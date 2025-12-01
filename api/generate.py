import json
from dotenv import load_dotenv
from vortai import GeminiAI

# Load environment variables
load_dotenv()

ai = GeminiAI()


def handler(event, context):
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
