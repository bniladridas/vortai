from flask import jsonify, request
from dotenv import load_dotenv
from vortai import GeminiAI

# Load environment variables
load_dotenv()

ai = GeminiAI()


def generate_with_thinking():
    """Generate text response with thinking."""
    try:
        data = request.json
        prompt = data.get("prompt", "").strip()

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        if len(prompt) > 5000:
            return jsonify({"error": "Prompt too long (max 5000 chars)"}), 400

        result = ai.generate_text_with_thinking(prompt)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
