"use strict";
// SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
// SPDX-License-Identifier: MIT
// Initialize marked.js for markdown rendering
marked.setOptions({
    breaks: true,
    gfm: true
});

// TTS button handler
function handleTTS() {
    const ttsButton = document.getElementById('tts-button');
    const text = ttsButton.getAttribute('data-text');
    const audioPlayer = document.getElementById('audio-player');

    if (!text || !text.trim()) {
        showError('No text available for TTS');
        return;
    }

    // Show loading state
    ttsButton.disabled = true;
    ttsButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('TTS request failed');
        }
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        audioPlayer.src = url;
        audioPlayer.style.display = 'block';
        audioPlayer.play();
    })
    .catch(error => {
        console.error('TTS Error:', error);
        showError('Failed to generate audio. Please try again.');
    })
    .finally(() => {
        // Reset button state
        ttsButton.disabled = false;
        ttsButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    });
}

// Unified search handler
function handleUnifiedSearch() {
    const input = document.querySelector('.unified-input');
    const { mode, style } = getSelectedMode();
    const prompt = input.value.trim();
    if (!prompt) {
        showError('Hmm… we\'re waiting on your next word. What would you like to ask?');
        return;
    }
    // Clear previous results
    clearResults();
    // Show loading state
    showLoading(mode);
    // Route to appropriate handler based on mode and style
    if (mode === 'text') {
        handleTextGeneration(prompt, style);
    }
    else if (mode === 'image') {
        handleImageGeneration(prompt);
    }
}
// Clear all result containers
function clearResults() {
    const responseContainer = document.getElementById('response');
    const thinkingContainer = document.getElementById('thinking');
    const imageContainer = document.getElementById('image-container');
    const ttsButton = document.getElementById('tts-button');
    const audioPlayer = document.getElementById('audio-player');
    responseContainer.style.display = 'none';
    thinkingContainer.style.display = 'none';
    imageContainer.style.display = 'none';
    ttsButton.style.display = 'none';
    audioPlayer.style.display = 'none';
    audioPlayer.pause();
    audioPlayer.src = '';
}
// Show loading state
function showLoading(mode) {
    const submitButton = document.getElementById('submit-button');
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    if (mode === 'text') {
        const responseContainer = document.getElementById('response');
        responseContainer.innerHTML = '<em id="thinking-text" class="character-by-character">Thinking...</em>';
        animateText(responseContainer.querySelector('#thinking-text'));
        responseContainer.style.display = 'block';
    }
    else if (mode === 'image') {
        const imageContainer = document.getElementById('image-container');
        const imageMessage = document.getElementById('image-message');
        imageMessage.textContent = 'Generating your image. This may take a minute...';
        imageMessage.style.display = 'block';
        imageContainer.style.display = 'block';
    }
}
// Hide loading state
function hideLoading() {
    const submitButton = document.getElementById('submit-button');
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
}
// Show error message
function showError(message) {
    const responseContainer = document.getElementById('response');
    responseContainer.innerHTML = `<em>Error: ${message}</em>`;
    responseContainer.style.display = 'block';
}
// Handle text generation based on style
function handleTextGeneration(prompt, style) {
    if (style === 'thinking') {
        handleThinkingMode(prompt);
    }
    else if (style === 'url-context') {
        handleUrlContext(prompt);
    }
    else {
        handleNormalGeneration(prompt);
    }
}
// Handle normal text generation
function handleNormalGeneration(prompt) {
    fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt })
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error('Hmm… grace takes time. Try again.');
        }
        return response.json();
    })
        .then((data) => {
        const responseContainer = document.getElementById('response');
        responseContainer.innerHTML = marked.parse(data.response || '');
        // Show the TTS button if we have a response
        if (data.response && data.response.trim()) {
            const ttsButton = document.getElementById('tts-button');
            ttsButton.style.display = 'block';
            ttsButton.setAttribute('data-text', data.response);
        }
        hideLoading();
    })
        .catch((error) => {
        console.error('Error:', error);
        showError(error.message);
        hideLoading();
    });
}
// Get selected mode
function getSelectedMode() {
    const activeTab = document.querySelector('.search-tab.active');
    return {
        mode: activeTab.dataset.mode || '',
        style: activeTab.dataset.style || ''
    };
}
// Character-by-character animation
function animateText(element) {
    const text = element.textContent || '';
    element.textContent = '';
    let i = 0;
    const intervalId = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i === text.length) {
            clearInterval(intervalId);
        }
    }, 20);
}
// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    setupUnifiedSearchHandlers();
    setupThemeToggle();
    setupMenuToggle();
    // Initialize suggestions visibility
    updateSuggestionsVisibility();
    // Add other setup functions as needed
});
// Setup unified search handlers
function setupUnifiedSearchHandlers() {
    const input = document.querySelector('.unified-input');
    const submitButton = document.getElementById('submit-button');
    const clearButton = document.getElementById('clear-button');
    const searchTabs = document.querySelectorAll('.search-tab');

    // Handle search tab clicks
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            searchTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            // Update suggestions visibility
            updateSuggestionsVisibility();
        });
    });

    // Handle submit button click
    submitButton.addEventListener('click', handleUnifiedSearch);
    // Handle clear button click
    clearButton.addEventListener('click', function () {
        input.value = '';
        clearButton.style.display = 'none';
        clearResults();
        input.focus();
    });
    // Handle Enter key press
    input.addEventListener('keypress', function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleUnifiedSearch();
        }
    });
    // Show/hide clear button and suggestions based on input content
    input.addEventListener('input', function () {
        const hasContent = input.value.trim();
        clearButton.style.display = hasContent ? 'block' : 'none';
        updateSuggestionsVisibility();
        // Auto-resize textarea
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    // Handle suggestion chip clicks
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            input.value = this.dataset.text;
            input.focus();
            // Trigger input event to hide suggestions and show clear button
            input.dispatchEvent(new Event('input'));
        });
    });
    // Auto-focus on input
    input.focus();
}

// Setup menu toggle functionality
function setupMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenu = document.getElementById('close-menu');

    // Function to open menu
    function openMenu() {
        sidebarMenu.classList.add('open');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    // Function to close menu
    function closeMenuFunc() {
        sidebarMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
    }

    // Menu toggle button click
    menuToggle.addEventListener('click', openMenu);

    // Close menu button click
    closeMenu.addEventListener('click', closeMenuFunc);

    // Overlay click to close
    menuOverlay.addEventListener('click', closeMenuFunc);

    // Close menu on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebarMenu.classList.contains('open')) {
            closeMenuFunc();
        }
    });

    // TTS button click
    const ttsButton = document.getElementById('tts-button');
    if (ttsButton) {
        ttsButton.addEventListener('click', handleTTS);
    }
}

// Setup theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Handle theme toggle click
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            // Switch to dark theme
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            // Switch to light theme
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Update suggestions visibility based on active tab and input content
function updateSuggestionsVisibility() {
    const input = document.querySelector('.unified-input');
    const hasContent = input.value.trim();
    const suggestions = document.getElementById('input-suggestions');
    const activeTab = document.querySelector('.search-tab.active');

    if (hasContent) {
        suggestions.style.display = 'none';
        return;
    }

    // Show suggestions container
    suggestions.style.display = 'flex';

    // Get active tab style
    const tabStyle = activeTab.dataset.style || 'normal';
    const tabMode = activeTab.dataset.mode || 'text';

    // Hide all suggestion chips first
    const allChips = document.querySelectorAll('.suggestion-chip');
    allChips.forEach(chip => chip.style.display = 'none');

    // Show chips for current tab
    let chipsToShow;
    if (tabMode === 'image') {
        chipsToShow = document.querySelectorAll('.tab-image');
    } else if (tabStyle === 'thinking') {
        chipsToShow = document.querySelectorAll('.tab-thinking');
    } else if (tabStyle === 'url-context') {
        chipsToShow = document.querySelectorAll('.tab-url');
    } else {
        // Canvas/normal text mode
        chipsToShow = document.querySelectorAll('.tab-canvas');
    }

    chipsToShow.forEach(chip => chip.style.display = 'inline-block');
}
// Placeholder for other functions (simplified for demo)
function handleThinkingMode(prompt) {
    fetch('/api/generate-with-thinking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt })
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error('Hmm… grace takes time. Try again.');
        }
        return response.json();
    })
        .then((data) => {
        const responseContainer = document.getElementById('response');
        responseContainer.innerHTML = marked.parse(data.response || '');
        // Show the TTS button if we have a response
        if (data.response && data.response.trim()) {
            const ttsButton = document.getElementById('tts-button');
            ttsButton.style.display = 'block';
            ttsButton.setAttribute('data-text', data.response);
        }
        hideLoading();
    })
        .catch((error) => {
        console.error('Error:', error);
        showError(error.message);
        hideLoading();
    });
}
function handleUrlContext(prompt) {
    fetch('/api/generate-with-url-context', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt })
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error('Hmm… grace takes time. Try again.');
        }
        return response.json();
    })
        .then((data) => {
        const responseContainer = document.getElementById('response');
        responseContainer.innerHTML = marked.parse(data.response || '');
        // Show the TTS button if we have a response
        if (data.response && data.response.trim()) {
            const ttsButton = document.getElementById('tts-button');
            ttsButton.style.display = 'block';
            ttsButton.setAttribute('data-text', data.response);
        }
        hideLoading();
    })
        .catch((error) => {
        console.error('Error:', error);
        showError(error.message);
        hideLoading();
    });
}
function handleImageGeneration(prompt) {
    fetch('/api/generate-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt })
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error('Hmm… grace takes time. Try again.');
        }
        return response.json();
    })
        .then((data) => {
        const imageContainer = document.getElementById('image-container');
        const generatedImage = document.getElementById('generated-image');
        const imageMessage = document.getElementById('image-message');
        const downloadImage = document.getElementById('download-image');
        const fullscreenImage = document.getElementById('fullscreen-image');

        if (data.image_url) {
            generatedImage.src = data.image_url;
            generatedImage.style.display = 'block';
            downloadImage.href = data.image_url;
            downloadImage.style.display = 'inline-block';
            fullscreenImage.style.display = 'inline-block';
            imageMessage.style.display = 'none';
        } else {
            imageMessage.textContent = data.message || 'Image generation failed';
            imageMessage.style.display = 'block';
        }

        imageContainer.style.display = 'block';
        hideLoading();
    })
        .catch((error) => {
        console.error('Error:', error);
        const imageContainer = document.getElementById('image-container');
        const imageMessage = document.getElementById('image-message');
        imageMessage.textContent = error.message;
        imageMessage.style.display = 'block';
        imageContainer.style.display = 'block';
        hideLoading();
    });
}
