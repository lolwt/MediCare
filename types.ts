export enum DoseStatus {
  PENDING = 'PENDING',
  TAKEN = 'TAKEN',
  SKIPPED = 'SKIPPED',
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  status: DoseStatus;
  pillImage?: string; // URL or base64 string
}

export type NewMedication = Omit<Medication, 'id' | 'status'>;

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface MedicationContextType {
  medications: Medication[];
  addMedication: (med: NewMedication) => void;
  updateDoseStatus: (id: number, status: DoseStatus) => void;
  learnMore: (medicationName: string, dosage: string) => void;
}
