import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { NewMedication } from '../types';
import { identifyPill } from '../services/geminiService';
import { ArrowLeftIcon, CameraIcon, CloseIcon, SpinnerIcon } from './Icons';
import { MedicationContext } from '../contexts/MedicationContext';

interface AddMedicationModalProps {
  onClose: () => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ onClose }) => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('AddMedicationModal must be used within a MedicationProvider');
  }
  const { addMedication } = context;

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [pillImage, setPillImage] = useState<string | null>(null);
  const [pillImageType, setPillImageType] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [identificationResult, setIdentificationResult] = useState('');
  
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

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
  
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPillImageType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPillImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentifyPill = useCallback(async () => {
    if (!pillImage || !pillImageType) return;
    
    setIsLoading(true);
    setIdentificationResult('');

    const base64Data = pillImage.split(',')[1];
    const result = await identifyPill(base64Data, pillImageType);
    
    setIdentificationResult(result);
    setIsLoading(false);
  }, [pillImage, pillImageType]);

  const handleSubmit = () => {
    if (name && dosage && time) {
      const newMed: NewMedication = { name, dosage, time, pillImage: pillImage || undefined };
      addMedication(newMed);
      onClose();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-3xl font-bold mb-6 text-center">Step 1: Medication Name</h3>
            <label className="block text-xl font-semibold mb-2" htmlFor="med-name">Medication Name</label>
            <input ref={firstInputRef} id="med-name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Lisinopril" />
            <label className="block text-xl font-semibold mb-2 mt-6" htmlFor="med-dosage">Dosage</label>
            <input id="med-dosage" type="text" value={dosage} onChange={e => setDosage(e.target.value)} className="w-full p-4 text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., 10mg" />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-3xl font-bold mb-6 text-center">Step 2: Schedule</h3>
            <label className="block text-xl font-semibold mb-2" htmlFor="med-time">Time to Take</label>
            <input id="med-time" type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-4 text-4xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" />
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-3xl font-bold mb-6 text-center">Step 3: Pill Photo (Optional)</h3>
            <div className="flex flex-col items-center">
              <label htmlFor="pill-photo" className="cursor-pointer flex flex-col items-center gap-4 bg-gray-100 p-8 rounded-lg border-2 border-dashed border-gray-400 hover:bg-gray-200 hover:border-blue-500">
                {pillImage ? (
                  <img src={pillImage} alt="Pill preview" className="h-40 w-40 rounded-full object-cover" />
                ) : (
                  <>
                    <CameraIcon className="h-20 w-20 text-gray-500" />
                    <span className="text-xl text-gray-700 font-semibold">Take or Upload Photo</span>
                  </>
                )}
              </label>
              <input id="pill-photo" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              
              {pillImage && (
                <button onClick={handleIdentifyPill} disabled={isLoading} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-md disabled:bg-gray-400 flex items-center gap-2">
                  {isLoading ? <><SpinnerIcon /> Identifying...</> : 'Identify This Pill'}
                </button>
              )}

              {identificationResult && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg w-full">
                  <h4 className="text-xl font-bold text-blue-800">Identification Result:</h4>
                  <p className="text-lg whitespace-pre-wrap">{identificationResult}</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (step === 1) return name.trim() !== '' && dosage.trim() !== '';
    if (step === 2) return time.trim() !== '';
    return true;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-4xl font-bold">Add Medication</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close">
            <CloseIcon className="h-10 w-10 text-gray-600" />
          </button>
        </div>
        <p className="text-center text-xl text-gray-500 font-semibold mb-6">Step {step} of 3</p>
        
        <div className="min-h-[300px]">
          {renderStep()}
        </div>

        <div className="mt-8 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={handleBack} className="flex items-center gap-2 text-xl font-bold py-4 px-6 rounded-lg bg-gray-200 hover:bg-gray-300">
              <ArrowLeftIcon /> Back
            </button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button onClick={handleNext} disabled={!canProceed()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 px-6 rounded-lg disabled:bg-gray-400">
              Next Step
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canProceed()} className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-4 px-6 rounded-lg disabled:bg-gray-400">
              Save Medication
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMedicationModal;