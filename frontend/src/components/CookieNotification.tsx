import React from 'react';

interface CookieNotificationProps {
  onAccept: () => void;
}

const CookieNotification: React.FC<CookieNotificationProps> = ({ onAccept }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 border-t border-gray-700">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <p className="text-sm">
          This website uses cookies to improve your experience. By using our site, you agree to our use of cookies.
        </p>
        <button
          onClick={onAccept}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default CookieNotification;