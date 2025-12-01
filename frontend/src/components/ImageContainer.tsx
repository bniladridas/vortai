import React from 'react';

interface ImageContainerProps {
  imageUrl: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="image-container">
      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.125rem',
        fontWeight: '600',
        color: 'var(--secondary)',
        textAlign: 'center'
      }}>
        🎨 Generated Image
      </h3>
      <img
        src={imageUrl}
        alt="AI generated content"
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      />
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a
          href={imageUrl}
          download="generated_image.png"
          className="button button-secondary"
        >
          📥 Download
        </a>
      </div>
    </div>
  );
};

export default ImageContainer;
