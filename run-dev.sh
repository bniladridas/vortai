#!/bin/bash

# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT

# Vortai Development Services Manager
# Usage: ./run-dev.sh [all|backend|frontend|go]

SERVICE=${1:-"help"}

show_help() {
    echo "🚀 Vortai Development Services Manager"
    echo "======================================="
    echo ""
    echo "Usage: ./run-dev.sh [SERVICE]"
    echo ""
    echo "Services:"
    echo "  all       - Start all services (backend + frontend + go)"
    echo "  backend   - Start Flask backend only (port 8000)"
    echo "  frontend  - Start React frontend only (port 3000)"
    echo "  go        - Start Go text processing service only (port 8080)"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./run-dev.sh all        # Start everything"
    echo "  ./run-dev.sh backend    # Backend development"
    echo "  ./run-dev.sh frontend   # Frontend development"
    echo "  ./run-dev.sh go         # Go service development"
    echo ""
}

check_env() {
    if [ ! -f ".env" ]; then
        echo "❌ Error: .env file not found!"
        echo "Please create .env file with GEMINI_API_KEY=your-key"
        exit 1
    fi

    if ! grep -q "GEMINI_API_KEY=" .env; then
        echo "❌ Error: GEMINI_API_KEY not found in .env file!"
        exit 1
    fi

    echo "✅ Environment check passed"
}

start_go() {
    echo "🐹 Starting Go text processing service..."
    cd go/src
    go run main.go &
    GO_PID=$!
    cd ../..
    echo "⏳ Waiting for Go service to start..."
    sleep 2
    echo "✅ Go Service: http://localhost:8080"
}

start_backend() {
    echo "🔧 Starting Flask backend..."
    uv run python app.py &
    BACKEND_PID=$!
    echo "⏳ Waiting for backend to start..."
    sleep 3
    echo "✅ Backend: http://localhost:8000"
}

start_frontend() {
    echo "🎨 Starting React frontend..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    echo "✅ Frontend: http://localhost:3000"
}

cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $GO_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Main service handling logic
case $SERVICE in
    "all")
        echo "🚀 Starting ALL Vortai Services"
        echo "==============================="
        check_env
        trap cleanup SIGINT SIGTERM
        start_go && start_backend && start_frontend
        echo ""
        echo "✅ All services started!"
        echo "🐹 Go Service: http://localhost:8080"
        echo "🔧 Backend: http://localhost:8000"
        echo "📱 Frontend: http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop all services"
        wait
        ;;

    "backend")
        echo "🔧 Starting Flask Backend Only"
        echo "=============================="
        check_env
        trap cleanup SIGINT SIGTERM
        start_backend
        echo ""
        echo "Press Ctrl+C to stop backend"
        wait
        ;;

    "frontend")
        echo "🎨 Starting React Frontend Only"
        echo "==============================="
        trap cleanup SIGINT SIGTERM
        start_frontend
        echo ""
        echo "Press Ctrl+C to stop frontend"
        wait
        ;;

    "go")
        echo "🐹 Starting Go Service Only"
        echo "==========================="
        trap cleanup SIGINT SIGTERM
        start_go
        echo ""
        echo "Press Ctrl+C to stop Go service"
        wait
        ;;

    "help"|*)
        show_help
        ;;
esac
