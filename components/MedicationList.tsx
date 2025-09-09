import React, { useContext, useMemo } from 'react';
import { Medication } from '../types';
import MedicationItem from './MedicationItem';
import { MedicationContext } from '../contexts/MedicationContext';

const MedicationList: React.FC = () => {
  const context = useContext(MedicationContext);

  if (!context) {
    throw new Error('MedicationList must be used within a MedicationProvider');
  }

  const { medications } = context;

  const groupedAndSortedMeds = useMemo(() => {
    if (medications.length === 0) {
      return null;
    }

    const getTimeCategory = (time: string): 'Morning' | 'Afternoon' | 'Evening' | 'Night' => {
      const hour = parseInt(time.split(':')[0], 10);
      if (hour >= 4 && hour < 12) return 'Morning';
      if (hour >= 12 && hour < 17) return 'Afternoon';
      if (hour >= 17 && hour < 21) return 'Evening';
      return 'Night';
    };

    const groupedMeds = medications.reduce((acc, med) => {
      const category = getTimeCategory(med.time);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(med);
      return acc;
    }, {} as Record<string, Medication[]>);

    // Sort meds within each category
    for (const category in groupedMeds) {
      groupedMeds[category].sort((a, b) => a.time.localeCompare(b.time) || a.name.localeCompare(b.name));
    }

    return groupedMeds;
  }, [medications]);


  if (!groupedAndSortedMeds) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700">No Medications Scheduled</h2>
        <p className="text-lg text-gray-500 mt-2">Click "Add New" to get started.</p>
      </div>
    );
  }
  
  const categories: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="space-y-8">
      {categories.map(category => (
        groupedAndSortedMeds[category] && groupedAndSortedMeds[category].length > 0 && (
          <section key={category} aria-labelledby={`${category}-heading`}>
            <h2 id={`${category}-heading`} className="text-2xl font-bold text-gray-700 mb-4 border-b-2 border-gray-200 pb-2">{category}</h2>
            <div className="space-y-4">
              {groupedAndSortedMeds[category].map(med => (
                <MedicationItem
                  key={med.id}
                  medication={med}
                />
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  );
};

export default MedicationList;