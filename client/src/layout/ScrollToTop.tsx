import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const ScrollToTop: React.FC = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
    >
      <FiTrendingUp className="text-xl" />
    </button>
  );
};

export default ScrollToTop;