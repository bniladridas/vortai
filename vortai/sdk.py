# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT

"""
Gemini AI SDK - Simple interface for Google's Gemini AI models.
"""

import os
import uuid
import tempfile
import mimetypes
import asyncio
from typing import Optional, Dict, Any
import google.generativeai as genai
from gtts import gTTS
from google import genai as google_genai
from google.genai import types
from . import models


class GeminiAI:
    """SDK for interacting with Gemini AI models."""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize with API key."""
        api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required")
        genai.configure(api_key=api_key)
        self.cache = {}  # Simple in-memory cache

    def generate_text(self, prompt: str) -> str:
        """Generate text response from prompt."""
        if not prompt or len(prompt) > 5000:
            raise ValueError("Invalid prompt")
        key = hash(prompt)
        if key in self.cache:
            return self.cache[key]
        model = genai.GenerativeModel(models.TEXT_MODEL)
        response = model.generate_content(prompt)
        result = response.text
        self.cache[key] = result
        return result

    def generate_text_with_thinking(self, prompt: str) -> Dict[str, Any]:
        """Generate text with thinking summary."""
        if not prompt or len(prompt) > 5000:
            raise ValueError("Invalid prompt")
        client = google_genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        response = client.models.generate_content(
            model=models.THINKING_MODEL,
            contents=prompt,
            config={"thinking_config": {"include_thoughts": True}},
        )
        main_response = response.text if hasattr(response, "text") else ""
        thinking_summary = []
        if hasattr(response, "candidates") and response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, "content") and hasattr(candidate.content, "parts"):
                for part in candidate.content.parts:
                    if hasattr(part, "thought") and part.thought:
                        thinking_summary.append(
                            part.text if hasattr(part, "text") else str(part.thought)
                        )
        return {"response": main_response, "thinking_summary": thinking_summary}

    def generate_text_with_url_context(self, prompt: str) -> str:
        """Generate text with URL context."""
        if not prompt or len(prompt) > 5000:
            raise ValueError("Invalid prompt")
        client = google_genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        url_context_tool = types.Tool(url_context=types.UrlContext())
        response = client.models.generate_content(
            model=models.URL_CONTEXT_MODEL,
            contents=prompt,
            config={"tools": [url_context_tool]},
        )
        return response.text

    def text_to_speech(self, text: str) -> str:
        """Convert text to speech and return file path."""
        if not text or len(text) > 1000:
            raise ValueError("Invalid text")
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(tempfile.gettempdir(), "gemini_tts", filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        tts = gTTS(text=text, lang="en", slow=False)
        tts.save(filepath)
        return filepath

    def generate_image(self, prompt: str) -> str:
        """Generate image and return file path."""
        if not prompt or len(prompt) > 5000:
            raise ValueError("Invalid prompt")
        client = google_genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        model = models.IMAGE_MODEL
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=f"Generate an image of: {prompt}"),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_modalities=["image", "text"],
            response_mime_type="text/plain",
        )
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        )
        if (
            response.candidates
            and response.candidates[0].content
            and response.candidates[0].content.parts
        ):
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    file_extension = mimetypes.guess_extension(
                        part.inline_data.mime_type
                    )
                    filename = f"{uuid.uuid4()}{file_extension}"
                    filepath = os.path.join(
                        tempfile.gettempdir(), "gemini_images", filename
                    )
                    os.makedirs(os.path.dirname(filepath), exist_ok=True)
                    with open(filepath, "wb") as f:
                        f.write(part.inline_data.data)
                    return filepath
        raise ValueError("Failed to generate image")
