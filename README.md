# Vortai

[![Python Version](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-23%20passed-green.svg)](https://github.com/bniladridas/vortai/actions)

Advanced AI platform with web search, URL analysis, text generation, image creation, and transparent thinking processes. Real-time web data access powered by Google Gemini API.

The full API documentation can be found in [docs/api-examples.md](docs/api-examples.md).

## Installation

### Prerequisites

- Python 3.9 or later
- Node.js 18+ (for React frontend development)
- Rust (for performance extensions)
- Go (optional, for additional services)

### Quick Setup

Clone the repository and run the setup script:

```bash
git clone https://github.com/bniladridas/vortai.git
cd vortai
./setup.sh
```

This installs all dependencies, builds extensions, and sets up the development environment.

### Starting Services

Use the development manager to start services:

```bash
# Start all services
./run-dev.sh all

# Start individual services
./run-dev.sh backend    # React Flask server (port 8000)
./run-dev.sh static     # Static web interface (port 5001)
./run-dev.sh frontend   # React development server (port 3000)
./run-dev.sh go         # Go text processor (port 8080)

# Start both web interfaces
./run-dev.sh interfaces # React (8000) + Static (5001)

# Show help
./run-dev.sh help
```

### Manual Installation

```bash
# Install Python dependencies
uv sync

# Build Rust extension (optional, for performance)
cd vortai/rust_ext && maturin develop && cd ../..

# Build Cython extension (optional, for performance)
uv run cythonize -i cython_ext/text_utils.pyx

# Install React frontend dependencies (for development)
cd frontend && npm install
```

## Quick Start

1. **Set your Gemini API key:**
    ```bash
    export GEMINI_API_KEY="your-api-key-here"
    ```

2. **Choose your interface:**

   **Option A: Vercel Static Interface (Production)**
   ```bash
   # Deployed at: https://vortai.vercel.app
   # Features: Static HTML interface with full API integration
   ```

   **Option B: React Interface (Development)**
   ```bash
   make run              # React interface on port 8000
   # Visit: http://localhost:8000
   ```

   **Option C: Static Web Interface (Development)**
   ```bash
   make run-static       # Static interface on port 5001
   # Visit: http://localhost:5001
   ```

   **Option D: Both Interfaces (Development)**
   ```bash
   ./run-dev.sh interfaces
   # React: http://localhost:8000
   # Static: http://localhost:5001
   ```

### Interface Options

**React Interface (Port 8000):**
- Modern single-page application
- Built with React + TypeScript
- Advanced UI components and animations
- Recommended for development and full features

**Static Interface (Port 5001):**
- Traditional HTML/CSS/JavaScript
- Lightweight and fast loading
- No build process required
- Perfect for simple deployments

Both interfaces provide identical functionality:
- ✅ Text generation (Canvas mode)
- ✅ AI thinking with reasoning steps
- ✅ Web search integration
- ✅ Text-to-speech (TTS)
- ✅ Image generation
- ✅ Dark/light theme support

### CLI Usage

```bash
# Activate virtual environment
source .venv/bin/activate

# Run CLI
python -m vortai
```

## Usage

### Basic Text Generation

```python
from vortai import GeminiAI

ai = GeminiAI()
response = await ai.generate_text("Explain quantum computing")
print(response)
```

### Thinking Mode with Reasoning

```python
result = ai.generate_text_with_thinking("Solve: 2x + 3 = 7")
print("Response:", result["response"])
print("Reasoning:", "\n".join(result["thinking_summary"]))
```

### Web Search Integration

```python
response = ai.generate_text_with_url_context(
    "Summarize the latest developments in AI from https://example.com"
)
print(response)
```

### Text-to-Speech

```python
filepath = ai.text_to_speech("Hello, world!")
# Returns path to generated MP3 file
```

### Image Generation

```python
filepath = ai.generate_image("A serene mountain landscape at sunset")
# Returns path to generated image file
```

## API Reference

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate` | Basic text generation |
| `POST` | `/api/generate-with-thinking` | Text generation with reasoning steps |
| `POST` | `/api/generate-with-url-context` | Text generation with web search context |
| `POST` | `/api/text-to-speech` | Convert text to speech (MP3) |
| `POST` | `/api/generate-image` | Generate images from text prompts |

### Request Format

All endpoints accept JSON requests:

```json
{
  "prompt": "Your prompt here",
  "max_length": 5000
}
```

### Response Format

Text generation endpoints return:

```json
{
  "response": "Generated text content",
  "thinking_summary": ["Step 1", "Step 2"] // Only for thinking mode
}
```

File generation endpoints return the file as a download.

## Error Handling

The library throws specific error types for different failure scenarios:

```python
from vortai import GeminiAI

ai = GeminiAI()

try:
    response = await ai.generate_text("Hello")
except ValueError as e:
    print(f"Invalid input: {e}")
except Exception as e:
    print(f"API error: {e}")
```

### Common Error Types

| Error Type | Description |
|------------|-------------|
| `ValueError` | Invalid input parameters |
| `ConnectionError` | Network connectivity issues |
| `TimeoutError` | Request timeout (default: 60s) |
| `AuthenticationError` | Invalid or missing API key |

## Advanced Usage

### Custom Model Configuration

```python
from vortai import GeminiAI
from vortai.models import TEXT_MODEL, THINKING_MODEL

ai = GeminiAI()

# Use specific models
response = await ai.generate_text("Prompt", model=TEXT_MODEL)
thinking = ai.generate_text_with_thinking("Prompt", model=THINKING_MODEL)
```

### Caching and Performance

The SDK includes automatic caching for text generation:

```python
ai = GeminiAI()

# First request (generates and caches)
response1 = await ai.generate_text("Explain recursion")

# Second request (returns cached result)
response2 = await ai.generate_text("Explain recursion")

assert response1 == response2  # True
```

### File Management

Generated files are automatically cleaned up, but you can manage them manually:

```python
import os
import tempfile

# TTS files are stored in temp directory
tts_file = ai.text_to_speech("Hello")
print(f"File saved to: {tts_file}")

# Clean up manually if needed
if os.path.exists(tts_file):
    os.remove(tts_file)
```

## Development

### Project Structure

```
vortai/
├── vortai/              # Main Python package
│   ├── sdk.py          # Gemini AI SDK
│   ├── models.py       # Model configurations
│   ├── routes/         # Flask API endpoints
│   └── extensions/     # Additional utilities
├── frontend/           # React TypeScript frontend (port 8000)
├── web/                # Static HTML/CSS/JS interface (port 5001)
│   ├── static/         # CSS, JS, images
│   └── templates/      # HTML templates
├── cython_ext/         # Cython performance extensions
├── vortai/rust_ext/    # Rust performance extensions
├── go/                 # Go services
├── tests/              # Comprehensive test suite
└── docs/               # Documentation
```

### Development Commands

```bash
# Code quality
make lint          # Lint Python code
make format        # Format code
uv run black .     # Format Python files

# Testing
make test          # Run all tests
uv run pytest tests/ --cov=vortai  # With coverage

# Development services
./run-dev.sh all           # Start all services
./run-dev.sh interfaces    # Both web interfaces (React + Static)
./run-dev.sh backend       # React Flask server (port 8000)
./run-dev.sh static        # Static web interface (port 5001)
./run-dev.sh frontend      # React development server (port 3000)
./run-dev.sh go           # Go processor only (port 8080)

# Building extensions
uv run cythonize -i cython_ext/text_utils.pyx  # Build Cython
cd vortai/rust_ext && cargo build --release   # Build Rust
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `FLASK_ENV` | Flask environment | `development` |
| `PYTHONPATH` | Python path | Current directory |

## Security

- **API Key Protection**: Never commit API keys to version control
- **Input Validation**: All inputs are validated and sanitized
- **Path Traversal Protection**: File paths are validated to prevent directory traversal
- **Rate Limiting**: Built-in request throttling (configurable)
- **Temporary File Cleanup**: Generated files are automatically cleaned up

## Requirements

### Runtime Support

- **Python**: 3.9 or later
- **Operating Systems**: Linux, macOS, Windows
- **Memory**: 512MB minimum, 2GB recommended
- **Disk Space**: 500MB for dependencies and cache

### Optional Performance Extensions

- **Rust**: For high-performance text processing
- **Cython**: For optimized Python extensions
- **Go**: For additional microservices

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md).

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/vortai.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Install dependencies: `./setup.sh`
5. Make your changes
6. Add tests for new functionality
7. Run tests: `make test`
8. Submit a pull request

### Code Style

- Follow PEP 8 for Python code
- Use type hints for all function parameters
- Add docstrings to all public functions
- Write comprehensive tests
- Use conventional commit messages

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Frequently Asked Questions

### How do I get a Gemini API key?

Visit the [Google AI Studio](https://makersuite.google.com/app/apikey) to create and manage your API keys.

### Can I use this in production?

Yes, but ensure you:
- Keep your API key secure
- Implement proper error handling
- Monitor API usage and costs
- Set up logging and monitoring

### How do I customize the models?

See the [models.py](vortai/models.py) file for available model configurations and how to modify them.

### What's the difference between thinking mode and regular generation?

Thinking mode provides step-by-step reasoning before the final answer, making it useful for complex problem-solving and educational content.

### How do I contribute performance optimizations?

We welcome contributions in Rust, Cython, or Go. See the respective directories for examples and contribution guidelines.

---

Built with ❤️ using Python, React, Rust, and Google Gemini AI.
