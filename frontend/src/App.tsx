import React, { useState } from 'react';
import Header from './components/Header';
import SearchInterface from './components/SearchInterface';
import ResponseContainer from './components/ResponseContainer';
import ThinkingContainer from './components/ThinkingContainer';
import ImageContainer from './components/ImageContainer';
import TTSButton from './components/TTSButton';
import AudioPlayer from './components/AudioPlayer';
import SidebarMenu from './components/SidebarMenu';
import MenuOverlay from './components/MenuOverlay';
import CookieNotification from './components/CookieNotification';

function App() {
  const [response, setResponse] = useState('');
  const [thinking, setThinking] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCookies, setShowCookies] = useState(true);

  return (
    <div className="app-container">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <main className="main-content">
        <section className="title-section">
          <h1>Vortai</h1>
          <p>Advanced AI platform with web search, text generation, and creative tools</p>
        </section>

        <SearchInterface
          onResponse={setResponse}
          onThinking={setThinking}
          onImage={setImageUrl}
          onAudio={setAudioUrl}
        />

        {response && <ResponseContainer content={response} />}

        {thinking && <ThinkingContainer content={thinking} />}

        {(response || audioUrl) && (
          <div className="media-controls">
            <TTSButton text={response} onAudio={setAudioUrl} />
            <AudioPlayer src={audioUrl} />
          </div>
        )}

        {imageUrl && <ImageContainer imageUrl={imageUrl} />}
      </main>

      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MenuOverlay isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {showCookies && (
        <CookieNotification onAccept={() => setShowCookies(false)} />
      )}
    </div>
  );
}

export default App;
