#!/bin/bash

# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT

# Setup script for Gemini AI Search
# Installs all required tools and dependencies

set -e

echo "Setting up Gemini AI Search..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install required tools
echo "Installing tools..."
brew install uv node typescript rust go

# Install uv (if not already)
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

# Set up Python environment
echo "Setting up Python environment..."
uv venv
source .venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
uv sync

# Build Rust extension (if maturin available)
if command -v maturin &> /dev/null; then
    echo "Building Rust extension..."
    cd gemini/rust_ext && maturin develop && cd ../..
else
    echo "Maturin not found, skipping Rust build. Install with: pip install maturin"
fi

# Compile TypeScript
echo "Compiling TypeScript..."
npx tsc --project web/static/ts

# Build Cython extension
echo "Building Cython extension..."
uv run cythonize -i cython_ext/text_utils.pyx

# Set up Go (if needed)
echo "Go is installed. Run Go services with: go run go/src/main.go"

echo "Setup complete."
echo "Run: source .venv/bin/activate && make run"
echo "For development: make lint, make format, make test"
