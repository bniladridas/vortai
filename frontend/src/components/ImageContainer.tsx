import React from 'react';

interface ImageContainerProps {
  imageUrl: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="image-container">
      <img
        src={imageUrl}
        alt="Generated content"
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '6px'
        }}
      />
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.75rem' }}>
        <a
          href={imageUrl}
          download="generated_image.png"
          className="button button-outline"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default ImageContainer;
