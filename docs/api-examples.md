# Advanced API Examples

## Raw Gemini API Usage

For advanced users, you can access the raw Google Gemini API directly:

```python
import google.generativeai as genai
from google import genai as google_genai

# Configure API
genai.configure(api_key="your-key")

# Text generation
model = genai.GenerativeModel("gemini-2.5-flash")
response = model.generate_content("Hello world")
print(response.text)

# Thinking mode
client = google_genai.Client(api_key="your-key")
response = client.models.generate_content(
    model="gemini-2.5-flash-preview-05-20",
    contents="Explain photosynthesis",
    config={"thinking_config": {"include_thoughts": True}}
)
```

## URL Context Integration

```python
from google.genai import types

url_context_tool = types.Tool(url_context=types.UrlContext())
response = client.models.generate_content(
    model="gemini-2.5-flash-preview-05-20",
    contents="Search for latest AI news",
    config={"tools": [url_context_tool]}
)
```

## Image Generation

```python
from google.genai import types

contents = [
    types.Content(
        role="user",
        parts=[
            types.Part.from_text(text="Generate an image of a cat"),
        ],
    ),
]

generate_content_config = types.GenerateContentConfig(
    response_modalities=["image", "text"],
    response_mime_type="text/plain",
)

response = client.models.generate_content(
    model="gemini-2.0-flash-exp-image-generation",
    contents=contents,
    config=generate_content_config,
)
```
