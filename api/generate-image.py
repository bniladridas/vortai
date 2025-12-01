from flask import send_file, jsonify
import os
import tempfile
import mimetypes
from dotenv import load_dotenv
from vortai import GeminiAI

# Load environment variables
load_dotenv()

ai = GeminiAI()


def handler(request):
    """Generate image from text prompt."""
    try:
        data = request.get_json()
        prompt = data.get("prompt", "").strip()

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        if len(prompt) > 5000:
            return jsonify({"error": "Prompt too long (max 5000 chars)"}), 400

        filepath = ai.generate_image(prompt)

        # Prevent path traversal
        if not os.path.commonpath(
            [os.path.abspath(tempfile.gettempdir()), os.path.abspath(filepath)]
        ) == os.path.abspath(tempfile.gettempdir()):
            return jsonify({"error": "Invalid file path"}), 400

        # Detect mime type
        mime_type, _ = mimetypes.guess_type(filepath)
        if not mime_type:
            mime_type = "image/png"

        return send_file(filepath, mimetype=mime_type)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
