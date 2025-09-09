import React, { useEffect } from 'react';
import { CloseIcon, SpinnerIcon } from './Icons';

interface MedicationInfoModalProps {
  medicationName: string;
  info: string | null;
  isLoading: boolean;
  onClose: () => void;
}

const MedicationInfoModal: React.FC<MedicationInfoModalProps> = ({ medicationName, info, isLoading, onClose }) => {
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="medication-info-title">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 id="medication-info-title" className="text-4xl font-bold">About {medicationName}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close">
            <CloseIcon className="h-10 w-10 text-gray-600" />
          </button>
        </div>
        
        <div>
          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <SpinnerIcon className="h-16 w-16 text-blue-600 animate-spin" />
              <p className="mt-4 text-2xl text-gray-600">Getting information...</p>
            </div>
          )}
          {info && !isLoading && (
            <div className="text-lg text-gray-700 space-y-4 whitespace-pre-wrap font-sans">
              {info}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationInfoModal;