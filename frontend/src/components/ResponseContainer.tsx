import React from 'react';

interface ResponseContainerProps {
  content: string;
}

const ResponseContainer: React.FC<ResponseContainerProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="response-container">
      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.125rem',
        fontWeight: '600',
        color: 'var(--primary)'
      }}>
        🤖 Response
      </h3>
      <div
        style={{
          lineHeight: '1.7',
          color: 'var(--text-secondary)'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default ResponseContainer;
