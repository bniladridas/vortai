import React from 'react';

interface ThinkingContainerProps {
  content: string;
}

const ThinkingContainer: React.FC<ThinkingContainerProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="thinking-container">
      <div style={{
        whiteSpace: 'pre-wrap',
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        fontFamily: 'monospace'
      }}>
        {content}
      </div>
    </div>
  );
};

export default ThinkingContainer;
