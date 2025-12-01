import React from 'react';

interface ThinkingContainerProps {
  content: string;
}

const ThinkingContainer: React.FC<ThinkingContainerProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-blue-400">Thinking Process</h3>
      <div className="whitespace-pre-wrap text-gray-300">{content}</div>
    </div>
  );
};

export default ThinkingContainer;