import json
import base64
import os
import tempfile
from dotenv import load_dotenv
from vortai import GeminiAI

# Load environment variables
load_dotenv()

ai = GeminiAI()


def handler(event, context):
    """Convert text to speech for Vercel serverless."""
    try:
        # Parse the request body
        if isinstance(event.get("body"), str):
            data = json.loads(event["body"])
        else:
            data = event.get("body", {})

        text = data.get("text", "").strip()

        if not text:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "No text provided"}),
            }

        if len(text) > 1000:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Text too long (max 1000 chars)"}),
            }

        filepath = ai.text_to_speech(text)

        # Prevent path traversal
        if not os.path.commonpath(
            [os.path.abspath(tempfile.gettempdir()), os.path.abspath(filepath)]
        ) == os.path.abspath(tempfile.gettempdir()):
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Invalid file path"}),
            }

        # Read the file and return as base64
        with open(filepath, "rb") as f:
            audio_data = f.read()

        # Clean up the file
        try:
            os.remove(filepath)
        except:
            pass

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "audio/mp3",
                "Content-Disposition": 'attachment; filename="tts_audio.mp3"',
            },
            "body": base64.b64encode(audio_data).decode("utf-8"),
            "isBase64Encoded": True,
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }
