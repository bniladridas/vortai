import React, { useState } from 'react';

interface TTSButtonProps {
  text: string;
  onAudio: (url: string) => void;
}

const TTSButton: React.FC<TTSButtonProps> = ({ text, onAudio }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTTS = async () => {
    if (!text.trim()) return;

    console.log('🔊 Starting TTS for text:', text.substring(0, 50) + '...');
    setIsLoading(true);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      console.log('📊 TTS response status:', response.status);

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        onAudio(url);
        console.log('✅ TTS audio generated successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ TTS error:', errorData.error);
        throw new Error(errorData.error || 'TTS failed');
      }
    } catch (error) {
      console.error('💥 TTS failed:', error);
    } finally {
      setIsLoading(false);
      console.log('🏁 TTS completed');
    }
  };

  if (!text.trim()) return null;

  return (
    <button
      onClick={handleTTS}
      disabled={isLoading}
      className={`button button-secondary ${isLoading ? 'loading' : ''}`}
    >
      {isLoading ? 'Generating...' : 'Listen'}
    </button>
  );
};

export default TTSButton;
