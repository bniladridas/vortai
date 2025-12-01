import React, { useState } from 'react';

interface TTSButtonProps {
  text: string;
  onAudio: (url: string) => void;
}

const TTSButton: React.FC<TTSButtonProps> = ({ text, onAudio }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTTS = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        onAudio(url);
      }
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!text.trim()) return null;

  return (
    <button
      onClick={handleTTS}
      disabled={isLoading}
      className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 transition-colors"
    >
      <i className="fas fa-volume-up mr-2"></i>
      {isLoading ? 'Generating...' : 'Listen'}
    </button>
  );
};

export default TTSButton;