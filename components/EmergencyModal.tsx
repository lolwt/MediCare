import React, { useEffect } from 'react';
import { CloseIcon, PhoneIcon } from './Icons';

interface EmergencyModalProps {
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close">
            <CloseIcon className="h-10 w-10 text-gray-600" />
          </button>
        </div>
        
        <h2 className="text-4xl font-bold text-red-600 mb-6">Emergency Contacts</h2>
        
        <div className="space-y-6">
          <a href="tel:911" className="block w-full text-center bg-red-100 border-2 border-red-500 rounded-lg p-6 hover:bg-red-200 transition-colors">
            <h3 className="text-3xl font-bold text-red-700">Call Emergency Services</h3>
            <p className="text-5xl font-bold text-red-800 mt-2 flex items-center justify-center gap-3">
              <PhoneIcon className="h-12 w-12" /> 911
            </p>
          </a>
          
          <a href="tel:123-456-7890" className="block w-full text-center bg-blue-100 border-2 border-blue-500 rounded-lg p-6 hover:bg-blue-200 transition-colors">
            <h3 className="text-3xl font-bold text-blue-700">Call Caregiver (Jane Doe)</h3>
            <p className="text-4xl font-bold text-blue-800 mt-2 flex items-center justify-center gap-3">
               <PhoneIcon className="h-10 w-10" /> 123-456-7890
            </p>
          </a>
        </div>
        
        <p className="mt-8 text-lg text-gray-600">
          Stay calm. Help is on the way. Your medication list is available for emergency responders.
        </p>
      </div>
    </div>
  );
};

export default EmergencyModal;