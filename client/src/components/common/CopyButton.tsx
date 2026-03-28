import React from 'react';
import { FiCopy } from 'react-icons/fi';

interface CopyButtonProps {
  text: string;
  onCopy: (text: string) => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, onCopy }) => {
  return (
    <button
      onClick={() => onCopy(text)}
      className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
    >
      <FiCopy /> Copy Address
    </button>
  );
};

export default CopyButton;