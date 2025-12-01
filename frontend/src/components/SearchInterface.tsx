import React, { useState, useRef, useEffect } from 'react';

interface SearchInterfaceProps {
  onResponse: (content: string) => void;
  onThinking: (content: string) => void;
  onImage: (url: string) => void;
  onAudio: (url: string) => void;
}

type Mode = 'text' | 'image';
type Style = 'normal' | 'thinking' | 'url-context';

interface TabConfig {
  mode: Mode;
  style: Style;
  label: string;
  icon: React.ReactNode;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onResponse,
  onThinking,
  onImage,
  onAudio
}) => {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<{ mode: Mode; style: Style }>({
    mode: 'text',
    style: 'normal'
  });
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tabs: TabConfig[] = [
    {
      mode: 'text',
      style: 'normal',
      label: 'Canvas',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
          <line x1="9" y1="9" x2="15" y2="9" stroke="currentColor"/>
          <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor"/>
        </svg>
      )
    },
    {
      mode: 'text',
      style: 'thinking',
      label: 'AI Thinking',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor"/>
          <circle cx="12" cy="5" r="1" fill="currentColor"/>
          <circle cx="19" cy="12" r="1" fill="currentColor"/>
          <circle cx="5" cy="12" r="1" fill="currentColor"/>
        </svg>
      )
    },
    {
      mode: 'text',
      style: 'url-context',
      label: 'Web search',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor"/>
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor"/>
        </svg>
      )
    },
    {
      mode: 'image',
      style: 'normal',
      label: 'Image generation',
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <polyline points="21,15 16,10 5,21" stroke="currentColor"/>
        </svg>
      )
    }
  ];

  const suggestions = {
    canvas: [
      'Explain quantum computing in simple terms',
      'Write a Python function to reverse a string',
      'Create a recipe for chocolate chip cookies'
    ],
    thinking: [
      'Solve this step by step: If a train travels at 60 mph for 2 hours, how far does it go?',
      'Explain the water cycle with detailed reasoning',
      'Calculate compound interest: $1000 at 5% for 3 years'
    ],
    url: [
      'Search https://en.wikipedia.org for information about quantum physics',
      'Find latest AI news from https://techcrunch.com and https://www.theverge.com',
      'Check https://github.com for popular Python repositories this month'
    ],
    image: [
      'A beautiful sunset over mountains with vibrant colors',
      'A futuristic city with flying cars and neon lights',
      'A cute cartoon robot with big eyes and a friendly smile'
    ]
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      console.log('🚀 Starting API call for:', activeTab);

      if (activeTab.mode === 'text') {
        let endpoint = '/api/generate';
        if (activeTab.style === 'thinking') {
          endpoint = '/api/generate-with-thinking';
        } else if (activeTab.style === 'url-context') {
          endpoint = '/api/generate-with-url-context';
        }

        console.log('📡 Calling endpoint:', endpoint);
        console.log('📝 Request payload:', { prompt: input });

        const response = await fetch(`http://localhost:8000${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input })
        });

        console.log('📊 Response status:', response.status);

        const data = await response.json();
        console.log('📄 Response data:', data);

        if (response.ok) {
          if (activeTab.style === 'thinking') {
            onThinking(data.thinking_summary?.join('\n') || '');
            onResponse(data.response || '');
            console.log('✅ Thinking response processed');
          } else {
            onResponse(data.response || '');
            console.log('✅ Text response processed');
          }
        } else {
          console.error('❌ API error:', data.error);
          throw new Error(data.error || 'API request failed');
        }
      } else if (activeTab.mode === 'image') {
        console.log('🎨 Calling image generation endpoint');

        const response = await fetch('http://localhost:8000/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input })
        });

        console.log('📊 Image response status:', response.status);

        // For images, the backend returns a file download
        if (response.ok) {
          // Create a blob URL from the response
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          onImage(url);
          console.log('✅ Image generated successfully');
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Image generation error:', errorData.error);
          throw new Error(errorData.error || 'Image generation failed');
        }
      }
    } catch (error) {
      console.error('💥 API call failed:', error);
      // You could show a user-friendly error message here
    } finally {
      setIsLoading(false);
      console.log('🏁 API call completed');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getCurrentSuggestions = () => {
    if (activeTab.mode === 'image') return suggestions.image;
    if (activeTab.style === 'thinking') return suggestions.thinking;
    if (activeTab.style === 'url-context') return suggestions.url;
    return suggestions.canvas;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  return (
    <div className="search-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>
          Search
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask anything..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            resize: 'none',
            minHeight: '24px',
            maxHeight: '120px',
            overflowY: 'auto',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}
          rows={1}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setInput('')}
            className="button button-outline"
            style={{
              padding: '0.5rem',
              opacity: input ? 1 : 0,
              pointerEvents: input ? 'auto' : 'none',
              minWidth: 'auto'
            }}
          >
            ×
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className={`button button-primary ${isLoading ? 'loading' : ''}`}
            style={{ padding: '0.75rem' }}
          >
            {isLoading ? '...' : 'Go'}
          </button>
        </div>
      </div>

      {!input && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {getCurrentSuggestions().map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="button button-outline"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                borderRadius: '20px',
                background: 'var(--surface-hover)'
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={`${tab.mode}-${tab.style}`}
            onClick={() => setActiveTab({ mode: tab.mode, style: tab.style })}
            className={`button ${activeTab.mode === tab.mode && activeTab.style === tab.style ? 'button-primary' : 'button-outline'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              minWidth: 'auto'
            }}
          >
            <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {tab.icon}
            </div>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchInterface;
