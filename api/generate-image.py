import json
import base64
import os
import tempfile
import mimetypes
from dotenv import load_dotenv
from vortai import GeminiAI

# Load environment variables
load_dotenv()

ai = GeminiAI()


def handler(event, context):
    """Generate image from text prompt for Vercel serverless."""
    try:
        # Parse the request body
        if isinstance(event.get("body"), str):
            data = json.loads(event["body"])
        else:
            data = event.get("body", {})

        prompt = data.get("prompt", "").strip()

        if not prompt:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "No prompt provided"}),
            }

        if len(prompt) > 5000:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Prompt too long (max 5000 chars)"}),
            }

        filepath = ai.generate_image(prompt)

        # Prevent path traversal
        if not os.path.commonpath(
            [os.path.abspath(tempfile.gettempdir()), os.path.abspath(filepath)]
        ) == os.path.abspath(tempfile.gettempdir()):
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Invalid file path"}),
            }

        # Detect mime type
        mime_type, _ = mimetypes.guess_type(filepath)
        if not mime_type:
            mime_type = "image/png"

        # Read the file and return as base64
        with open(filepath, "rb") as f:
            image_data = f.read()

        # Clean up the file
        try:
            os.remove(filepath)
        except:
            pass

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": mime_type,
                "Content-Disposition": 'inline; filename="generated_image.png"',
            },
            "body": base64.b64encode(image_data).decode("utf-8"),
            "isBase64Encoded": True,
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }
