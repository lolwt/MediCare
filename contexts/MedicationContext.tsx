import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Medication, DoseStatus, MedicationContextType, NewMedication } from '../types';

export const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

const initialMedications: Medication[] = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', time: '08:00', status: DoseStatus.PENDING, pillImage: 'https://picsum.photos/id/1/100/100' },
  { id: 2, name: 'Metformin', dosage: '500mg', time: '08:00', status: DoseStatus.TAKEN, pillImage: 'https://picsum.photos/id/2/100/100' },
  { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '20:00', status: DoseStatus.PENDING, pillImage: 'https://picsum.photos/id/3/100/100' },
  { id: 4, name: 'Amlodipine', dosage: '5mg', time: '20:00', status: DoseStatus.SKIPPED, pillImage: 'https://picsum.photos/id/4/100/100' },
  { id: 5, name: 'Levothyroxine', dosage: '50mcg', time: '07:00', status: DoseStatus.PENDING, pillImage: 'https://picsum.photos/id/5/100/100' },
  { id: 6, name: 'Simvastatin', dosage: '40mg', time: '21:00', status: DoseStatus.PENDING, pillImage: 'https://picsum.photos/id/6/100/100' },
];

const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  } catch (e) {
    console.error("Could not play notification sound:", e);
  }
};


export const MedicationProvider: React.FC<{ children: ReactNode; onLearnMore: (name: string, dosage: string) => void; }> = ({ children, onLearnMore }) => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  const updateDoseStatus = useCallback((id: number, status: DoseStatus) => {
    setMedications(prevMeds =>
      prevMeds.map(med => (med.id === id ? { ...med, status } : med))
    );
  }, []);

  const addMedication = useCallback((med: NewMedication) => {
    setMedications(prevMeds => [
      ...prevMeds,
      {
        ...med,
        id: prevMeds.length > 0 ? Math.max(...prevMeds.map(m => m.id)) + 1 : 1,
        status: DoseStatus.PENDING
      }
    ]);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Time-based notification check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      medications.forEach(med => {
        if (med.time === currentTime && med.status === DoseStatus.PENDING) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Time for your ${med.name}`, {
              body: `It's time to take your ${med.dosage} dose.`,
              icon: med.pillImage || '/favicon.ico',
            });
            playNotificationSound();
          } else {
            // Fallback for when notifications are not granted
            console.log(`Time to take your ${med.name} (${med.dosage})!`);
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [medications]);


  const contextValue: MedicationContextType = {
    medications,
    addMedication,
    updateDoseStatus,
    learnMore: onLearnMore,
  };

  return (
    <MedicationContext.Provider value={contextValue}>
      {children}
    </MedicationContext.Provider>
  );
};
