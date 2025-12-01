import React from 'react';

interface ResponseContainerProps {
  content: string;
}

const ResponseContainer: React.FC<ResponseContainerProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="response-container">
      <div
        style={{
          lineHeight: '1.6',
          color: 'var(--text)',
          fontSize: '1rem'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default ResponseContainer;
