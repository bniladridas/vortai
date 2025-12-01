import React from 'react';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed top-0 right-0 w-80 h-full bg-gray-800 border-l border-gray-700 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Menu</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor"/>
            </svg>
          </button>
        </div>
        <p className="text-gray-400">Additional features and settings will be available here.</p>
      </div>
    </div>
  );
};

export default SidebarMenu;