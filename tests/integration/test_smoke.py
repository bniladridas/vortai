import pytest
import os


def test_smoke():
    from app import create_app

    app = create_app()
    client = app.test_client()
    if not os.path.exists(os.path.join(app.template_folder, "index.html")):
        pytest.skip("Frontend build not found")
    response = client.get("/")
    assert response.status_code == 200
    print("Integration test passed: Root endpoint responds")
