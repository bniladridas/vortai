# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT
#
# This is the main entry point for the Gemini AI Search Flask application.
# It creates and runs the app using the factory pattern.

# Load environment variables from .env file
from dotenv import load_dotenv

load_dotenv()

from vortai import create_app

app = create_app()

# This is for Vercel serverless deployment
app.debug = False

if __name__ == "__main__":
    app.run()
