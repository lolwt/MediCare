import React, { memo, useContext } from 'react';
import { Medication, DoseStatus } from '../types';
import { CheckIcon, SkipIcon, ClockIcon, InfoIcon } from './Icons';
import { MedicationContext } from '../contexts/MedicationContext';

interface MedicationItemProps {
  medication: Medication;
}

const getStatusStyles = (status: DoseStatus) => {
  switch (status) {
    case DoseStatus.TAKEN:
      return {
        bgColor: 'bg-green-100',
        borderColor: 'border-green-500',
        textColor: 'text-green-800',
        text: 'Taken',
        icon: <CheckIcon className="h-8 w-8 text-green-600" />
      };
    case DoseStatus.SKIPPED:
      return {
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
        textColor: 'text-red-800',
        text: 'Skipped',
        icon: <SkipIcon className="h-8 w-8 text-red-600" />
      };
    default:
      return {
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-800',
        text: 'Pending',
        icon: <ClockIcon className="h-8 w-8 text-yellow-600" />
      };
  }
};

const MedicationItem: React.FC<MedicationItemProps> = ({ medication }) => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('MedicationItem must be used within a MedicationProvider');
  }
  const { updateDoseStatus, learnMore } = context;

  const { id, name, dosage, time, status, pillImage } = medication;
  const { bgColor, borderColor, textColor, text, icon } = getStatusStyles(status);

  return (
    <div className={`flex items-center gap-4 sm:gap-6 p-4 rounded-xl shadow-lg border-l-8 ${borderColor} ${bgColor} transition-all`}>
      {/* Pill Image */}
      <div className="flex-shrink-0">
        <img src={pillImage || 'https://picsum.photos/100'} alt={name} className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white shadow-md" />
      </div>

      {/* Medication Info */}
      <div className="flex-grow">
        <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{name}</h2>
            <button 
                onClick={() => learnMore(name, dosage)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Learn more about ${name}`}
            >
                <InfoIcon className="h-5 w-5" />
            </button>
        </div>
        <p className="text-lg sm:text-xl text-gray-600">{dosage}</p>
        <p className="text-xl sm:text-2xl font-semibold text-blue-600 mt-1 flex items-center gap-2">
          <ClockIcon className="h-6 w-6 sm:h-7 sm:w-7" /> {time}
        </p>
      </div>

      {/* Actions / Status */}
      <div className="flex-shrink-0 pr-2">
        {status === DoseStatus.PENDING ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => updateDoseStatus(id, DoseStatus.TAKEN)}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-lg sm:text-xl py-3 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
              aria-label={`Mark ${name} as taken`}
            >
              <CheckIcon className="h-7 w-7"/> Taken
            </button>
            <button
              onClick={() => updateDoseStatus(id, DoseStatus.SKIPPED)}
              className="flex items-center justify-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-bold text-lg sm:text-xl py-3 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
              aria-label={`Mark ${name} as skipped`}
            >
              <SkipIcon className="h-7 w-7"/> Skip
            </button>
          </div>
        ) : (
           <div className={`flex items-center gap-2 py-2 px-4 rounded-lg`}>
              {icon}
              <span className={`text-xl font-bold ${textColor}`}>{text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MedicationItem);