# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT
#
# This Makefile provides commands for linting, formatting, testing,
# and running the Gemini AI Search application.

.PHONY: lint format test run

lint:
	uv run ruff check .

format:
	uv run black .

test:
	GEMINI_API_KEY=dummy PYTHONPATH=. uv run pytest tests/

run:
	uv run python app.py

run-static:
	uv run python static_app.py

run-all:
	@echo "Starting both interfaces..."
	uv run python static_app.py &
	sleep 2
	uv run python app.py &
	@echo "React interface: http://localhost:8000"
	@echo "Static interface: http://localhost:5000"
	@echo "Press Ctrl+C to stop all services"
	wait
