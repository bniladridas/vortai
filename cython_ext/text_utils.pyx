# SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
# SPDX-License-Identifier: MIT

# Cython extension for fast text processing

def cython_clean_text(str text):
    """Fast text cleaning using Cython."""
    cdef list words = text.split()
    return ' '.join(words)