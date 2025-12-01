#!/bin/bash

# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT

# Script to run both Vortai backend and frontend simultaneously

echo "🚀 Starting Vortai - Backend + Frontend"
echo "========================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with GEMINI_API_KEY=your-key"
    exit 1
fi

# Check if API key is set
if ! grep -q "GEMINI_API_KEY=" .env; then
    echo "❌ Error: GEMINI_API_KEY not found in .env file!"
    exit 1
fi

echo "✅ Environment check passed"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $GO_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "🐹 Starting Go text processing service..."
cd go/src
go run main.go &
GO_PID=$!
cd ../..

echo "⏳ Waiting for Go service to start..."
sleep 2

echo "🔧 Starting Flask backend..."
source .venv/bin/activate
make run &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

echo "🎨 Starting React frontend..."
cd frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo "🐹 Go Service: http://localhost:8080"
echo "🔧 Backend: http://localhost:5000"
echo "📱 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait