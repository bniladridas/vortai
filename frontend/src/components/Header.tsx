import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you'd update the document class or use a theme context
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={toggleTheme}
          style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;
