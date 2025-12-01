import React from 'react';

interface ImageContainerProps {
  imageUrl: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <img
        src={imageUrl}
        alt="Generated image"
        className="max-w-full h-auto rounded-lg"
      />
      <div className="mt-4 flex gap-2">
        <a
          href={imageUrl}
          download="generated_image.png"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default ImageContainer;