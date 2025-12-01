import React from 'react';

interface ThinkingContainerProps {
  content: string;
}

const ThinkingContainer: React.FC<ThinkingContainerProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="thinking-container">
      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.125rem',
        fontWeight: '600',
        color: 'var(--accent)'
      }}>
        🧠 Thinking Process
      </h3>
      <div style={{
        whiteSpace: 'pre-wrap',
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        lineHeight: '1.6'
      }}>
        {content}
      </div>
    </div>
  );
};

export default ThinkingContainer;
