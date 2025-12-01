import React, { useState } from 'react';
import SearchInterface from './components/SearchInterface';
import ResponseContainer from './components/ResponseContainer';
import ThinkingContainer from './components/ThinkingContainer';
import ImageContainer from './components/ImageContainer';
import TTSButton from './components/TTSButton';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [response, setResponse] = useState('');
  const [thinking, setThinking] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  return (
    <div className="app-container">
      <main className="main-content">
        <SearchInterface
          onResponse={setResponse}
          onThinking={setThinking}
          onImage={setImageUrl}
          onAudio={setAudioUrl}
        />

        {response && <ResponseContainer content={response} />}

        {thinking && <ThinkingContainer content={thinking} />}

        {response && <TTSButton text={response} onAudio={setAudioUrl} />}

        {audioUrl && <AudioPlayer src={audioUrl} />}

        {imageUrl && <ImageContainer imageUrl={imageUrl} />}
      </main>
    </div>
  );
}

export default App;
