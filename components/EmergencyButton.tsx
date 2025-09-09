
import React from 'react';
import { PhoneIcon } from './Icons';

interface EmergencyButtonProps {
  onClick: () => void;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center justify-center w-24 h-24 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-transform transform hover:scale-110 z-40"
      aria-label="Emergency"
    >
      <div className="flex flex-col items-center">
        <PhoneIcon className="h-10 w-10" />
        <span className="text-lg font-bold mt-1">SOS</span>
      </div>
    </button>
  );
};

export default EmergencyButton;
