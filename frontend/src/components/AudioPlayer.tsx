import React from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  if (!src) return null;

  return (
    <audio controls className="w-full mb-4">
      <source src={src} type="audio/mp3" />
    </audio>
  );
};

export default AudioPlayer;