import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 md:flex-none px-8 py-4 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 hover:rotate-y-2
        ${active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/30'
          : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200/50'}`}
    >
      <span className="flex items-center gap-2 justify-center">
        {icon}
        {label}
      </span>
    </button>
  );
};

export default TabButton;