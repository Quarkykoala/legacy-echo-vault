import pytest
from backend.app import create_app

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_vaults(client):
    response = client.get("/api/v1/vaults")
    assert response.status_code == 200
    data = response.get_json()
    assert "vaults" in data
    assert isinstance(data["vaults"], list)
    assert all("id" in v for v in data["vaults"]) 