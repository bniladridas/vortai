import React from 'react';

interface ResponseContainerProps {
  content: string;
}

const ResponseContainer: React.FC<ResponseContainerProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default ResponseContainer;
