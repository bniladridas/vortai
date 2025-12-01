# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT

import os
from vortai import create_app

# Set dummy API key for testing
os.environ["GEMINI_API_KEY"] = "dummy"


def test_app_creation():
    """Test that the Flask app creates successfully."""
    app = create_app()
    assert app is not None
    assert app.name == "vortai"


def test_index_route():
    """Test the index route returns 200."""
    app = create_app()
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert b"Gem" in response.data  # Check for content in index.html


def test_generate_api_missing_prompt():
    """Test the generate API with missing prompt."""
    app = create_app()
    client = app.test_client()
    response = client.post("/api/generate", json={})
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert "No prompt provided" in data["error"]
