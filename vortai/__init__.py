# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT
#
# This module initializes the Flask application with CORS support,
# configures the Gemini API, and registers the API blueprint.

__version__ = "0.0.4"

from flask import Flask
from .sdk import GeminiAI
from flask_cors import CORS

__all__ = ["create_app", "GeminiAI", "main"]
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure the Gemini API with your API key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


def create_app():
    app = Flask(
        __name__,
        static_folder="../frontend/build/static",
        template_folder="../frontend/build",
    )
    CORS(app)  # Enable CORS for all routes

    # Register blueprints
    from .routes.api import api_bp

    app.register_blueprint(api_bp)

    @app.after_request
    def add_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

    return app


def main():
    """Entry point for the CLI application."""
    app = create_app()
    app.run()
