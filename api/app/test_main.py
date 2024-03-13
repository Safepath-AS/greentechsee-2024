from fastapi.testclient import TestClient

from .main import app
from .utils import haversine

client = TestClient(app)


def test_read_query_with_wrong_method():
    response = client.get("/")
    assert response.status_code == 405


def test_read_query_without_parameter():
    response = client.post("/")
    assert response.status_code == 422


def test_read_query_with_easter_egg():
    response = client.post("/?query=we%20are%20sinking")
    assert response.status_code == 200
    assert response.json() == {
        "type": "message",
        "author": "AI",
        "content": "Here is a relevant coordinate for you.",
        "data": {
            "type": "sinking",
            "location": {"latitude": 40.7128, "longitude": -74.006},
        },
    }


def test_haversine():
    assert haversine(0, 0, 0, 0) == 0
    assert haversine(0, 0, 0, 90) == 10007.543398010284
    assert haversine(0, 0, 90, 0) == 10007.543398010284
    assert haversine(0, 0, 90, 90) == 10007.543398010284


def test_haversine_invalid_range():
    try:
        haversine(-200, 0, 0, 0)
        assert False
    except ValueError as e:
        assert str(e) == "Invalid longitude"
