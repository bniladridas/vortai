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
    """Main handler that routes to specific functions based on query parameter."""
    method = event.get("query", {}).get("method", "generate")

    if method == "generate":
        return generate(event, context)
    elif method == "generate_with_thinking":
        return generate_with_thinking(event, context)
    elif method == "generate_with_url_context":
        return generate_with_url_context(event, context)
    elif method == "text_to_speech":
        return text_to_speech(event, context)
    elif method == "generate_image":
        return generate_image(event, context)
    else:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Unknown method"}),
        }


def generate(event, context):
    """Generate text response for Vercel serverless."""
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

        response = ai.generate_text(prompt)
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"response": response}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }


def generate_with_thinking(event, context):
    """Generate text response with thinking for Vercel serverless."""
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

        result = ai.generate_text_with_thinking(prompt)
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(result),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }


def generate_with_url_context(event, context):
    """Generate text response with URL context for Vercel serverless."""
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

        response = ai.generate_text_with_url_context(prompt)
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"response": response}),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }


def text_to_speech(event, context):
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
        except OSError:
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


def generate_image(event, context):
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
        except OSError:
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
