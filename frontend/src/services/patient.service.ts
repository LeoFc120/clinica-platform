import { apiFetch } from './api';

// Definimos la estructura exacta que tu backend nos va a devolver
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Para crear un paciente, no enviamos ID ni fechas de creación
export type CreatePatientDTO = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

export const PatientService = {
  // Obtener todos los pacientes
  getAll: async (): Promise<Patient[]> => {
    const response = await apiFetch('/patients');
    return response.data;
  },

  // Crear un nuevo paciente
  create: async (patient: CreatePatientDTO): Promise<Patient> => {
    const response = await apiFetch('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
    return response.data;
  },

  // Actualizar un paciente existente
  update: async (id: string, patient: Partial<CreatePatientDTO>): Promise<Patient> => {
    const response = await apiFetch(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
    return response.data;
  },

  // Eliminar un paciente
  delete: async (id: string): Promise<void> => {
    await apiFetch(`/patients/${id}`, {
      method: 'DELETE',
    });
  },
};
