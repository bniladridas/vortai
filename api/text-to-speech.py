from flask import send_file, jsonify, request
import os
import tempfile
from dotenv import load_dotenv
from vortai import GeminiAI

# Load environment variables
load_dotenv()

ai = GeminiAI()


def handler(request):
    """Convert text to speech."""
    try:
        data = request.get_json()
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "No text provided"}), 400

        if len(text) > 1000:
            return jsonify({"error": "Text too long (max 1000 chars)"}), 400

        filepath = ai.text_to_speech(text)

        # Prevent path traversal
        if not os.path.commonpath(
            [os.path.abspath(tempfile.gettempdir()), os.path.abspath(filepath)]
        ) == os.path.abspath(tempfile.gettempdir()):
            return jsonify({"error": "Invalid file path"}), 400

        filename = os.path.basename(filepath)
        return send_file(
            filepath, mimetype="audio/mp3", as_attachment=True, download_name=filename
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
