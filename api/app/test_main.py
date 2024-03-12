from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_query_without_parameter():
    response = client.get("/")
    assert response.status_code == 422


def test_read_query_with_query():
    response = client.get("/?query=we%20are%20sinking")
    assert response.status_code == 200
    assert response.json() == {
        "author": "AI",
        "content": "Here is a relevant coordinate for you.",
        "data": {
            "type": "sinking",
            "location": {"latitude": 40.7128, "longitude": -74.006},
        },
    }


def test_read_random():
    response = client.get("/random")
    assert response.status_code == 200
    assert 0 <= response.json() <= 100
