from flask import jsonify
from dotenv import load_dotenv
from vortai import GeminiAI

# Load environment variables
load_dotenv()

ai = GeminiAI()


def handler(request):
    """Generate text response with thinking."""
    try:
        data = request.get_json()
        prompt = data.get("prompt", "").strip()

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        if len(prompt) > 5000:
            return jsonify({"error": "Prompt too long (max 5000 chars)"}), 400

        result = ai.generate_text_with_thinking(prompt)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
