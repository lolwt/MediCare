import React, { useState, useCallback, useEffect } from 'react';
import { Medication, User } from './types';
import Header from './components/Header';
import MedicationList from './components/MedicationList';
import AddMedicationModal from './components/AddMedicationModal';
import EmergencyModal from './components/EmergencyModal';
import EmergencyButton from './components/EmergencyButton';
import MedicationInfoModal from './components/MedicationInfoModal';
import { PlusIcon } from './components/Icons';
import { getMedicationInfo } from './services/geminiService';
import { MedicationProvider } from './contexts/MedicationContext';

const App: React.FC = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // State for medication info modal
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<{name: string, dosage: string} | null>(null);
  const [medInfo, setMedInfo] = useState<string | null>(null);
  const [isInfoLoading, setInfoLoading] = useState(false);
  
  const handleLearnMore = useCallback(async (medicationName: string, dosage: string) => {
    setSelectedMed({ name: medicationName, dosage });
    setInfoModalOpen(true);
    setInfoLoading(true);
    setMedInfo(null);
    try {
      const info = await getMedicationInfo(medicationName, dosage);
      setMedInfo(info);
    } catch (error) {
      setMedInfo("Sorry, we couldn't fetch information for this medication right now.");
    } finally {
      setInfoLoading(false);
    }
  }, []);


  const handleLogin = () => setUser({ name: "Jane Doe", email: "jane.doe@example.com", avatarUrl: "https://i.pravatar.cc/150?u=jane" });
  const handleLogout = () => setUser(null);

  return (
    <MedicationProvider onLearnMore={handleLearnMore}>
      <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
        <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Today's Medications</h1>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              aria-label="Add new medication"
            >
              <PlusIcon />
              Add New
            </button>
          </div>
          
          <MedicationList />
        </main>

        <EmergencyButton onClick={() => setEmergencyModalOpen(true)} />

        {isAddModalOpen && (
          <AddMedicationModal
            onClose={() => setAddModalOpen(false)}
          />
        )}
        {isEmergencyModalOpen && (
          <EmergencyModal onClose={() => setEmergencyModalOpen(false)} />
        )}
        {isInfoModalOpen && selectedMed && (
          <MedicationInfoModal 
            medicationName={selectedMed.name}
            info={medInfo}
            isLoading={isInfoLoading}
            onClose={() => setInfoModalOpen(false)}
          />
        )}
      </div>
    </MedicationProvider>
  );
};

export default App;