from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "GreenTech!"}


def test_read_test_cd():
    response = client.get("/test-cd")
    assert response.status_code == 200
    assert response.json() == {"Test": "CD"}


def test_read_random():
    response = client.get("/random")
    assert response.status_code == 200
    assert 0 <= response.json() <= 100
