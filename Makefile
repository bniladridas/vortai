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
	uv run python -c "from app import create_app; app = create_app(); print('App created successfully')"

run:
	uv run python app.py
