import React from 'react';
import ReactMarkdown from 'react-markdown';
// SPDX-FileCopyrightText: Copyright (c) 2025 Niladri Das <bniladridas>
// SPDX-License-Identifier: MIT

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
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ResponseContainer;
