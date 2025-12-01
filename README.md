# Vortai

Advanced AI platform with web search, URL analysis, text generation, image creation, and transparent thinking processes. Real-time web data access powered by Google Gemini API.

## Overview

Vortai is a multi-language AI toolkit that provides:
- **LLM Integration**: Text generation with Google's Gemini models
- **Web Search**: URL context analysis for enhanced responses
- **TTS**: Text-to-speech conversion
- **Image Generation**: AI-powered image creation
- **Web Interface**: Modern UI for all capabilities
- **SDK**: Python library for easy integration

Built with Python, Rust, Cython, Go, and TypeScript for optimal performance.

## Features

- **Text Generation**: Async text generation with caching
- **Thinking Mode**: Step-by-step reasoning with summaries
- **URL Context**: Web search integration for contextual responses
- **Text-to-Speech**: MP3 generation from text
- **Image Generation**: AI image creation from prompts
- **Web UI**: Responsive interface with dark/light themes
- **Multi-Language**: Performance optimizations in Rust/Cython/Go
- **REST API**: Full API for all features
- **Deployment Ready**: Vercel serverless support

## Installation

### Prerequisites
- Python 3.9+
- Node.js (for TypeScript compilation)
- Rust (for extensions)
- Go (optional)

### Quick Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vortai.git
cd vortai
```

2. Run the setup script:
```bash
./setup.sh
```

This installs all dependencies and builds extensions.

### Manual Installation

```bash
# Install Python dependencies
uv sync

# Build Rust extension
cd vortai/rust_ext && maturin develop && cd ../..

# Compile TypeScript
npx tsc --project web/static/ts

# Build Cython extension
uv run cythonize -i cython_ext/text_utils.pyx
```

## Quick Start

1. Set your Gemini API key:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

2. Run the application:
```bash
make run
```

3. Open http://localhost:5000 in your browser

### CLI Usage

```bash
# Activate environment
source .venv/bin/activate

# Run CLI
python -m vortai
```

## SDK Usage

### Basic Text Generation

```python
from vortai import GeminiAI

ai = GeminiAI()
response = await ai.generate_text("Explain quantum computing")
print(response)
```

### Thinking Mode

```python
result = ai.generate_text_with_thinking("Solve: 2x + 3 = 7")
print("Response:", result["response"])
print("Thinking:", result["thinking_summary"])
```

### URL Context

```python
response = ai.generate_text_with_url_context("Summarize https://example.com")
print(response)
```

### Text-to-Speech

```python
filepath = ai.text_to_speech("Hello world")
# Returns path to MP3 file
```

### Image Generation

```python
filepath = ai.generate_image("A beautiful sunset")
# Returns path to generated image
```

## API Reference

### Endpoints

- `POST /api/generate` - Text generation
- `POST /api/generate-with-thinking` - Thinking mode
- `POST /api/generate-with-url-context` - URL context
- `POST /api/text-to-speech` - TTS conversion
- `POST /api/generate-image` - Image generation

### Request/Response Format

All endpoints accept JSON:
```json
{
  "prompt": "Your prompt here"
}
```

Responses include generated content or file paths.

## Development

### Project Structure

```
vortai/
├── vortai/           # Main Python package
│   ├── sdk.py       # Gemini AI SDK
│   ├── models.py    # Model configurations
│   ├── routes/      # API endpoints
│   └── rust_ext/    # Rust extensions
├── web/             # Frontend assets
├── cython_ext/      # Cython extensions
├── go/              # Go services
└── tests/           # Test suite
```

### Commands

```bash
make lint      # Lint code
make format    # Format code
make test      # Run tests
make run       # Start development server
```

### Building Extensions

```bash
# Rust
cd vortai/rust_ext && cargo build --release

# Cython
uv run cythonize -i cython_ext/text_utils.pyx

# TypeScript
npx tsc --project web/static/ts
```

## Security

- API key required for all operations
- Input validation on all endpoints
- Path traversal protection
- Security headers enabled
- Temporary file cleanup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Use conventional commits

## License

MIT License - see LICENSE file for details
