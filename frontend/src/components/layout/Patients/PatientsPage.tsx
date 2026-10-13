import { useEffect, useState } from 'react';
import { type Patient, PatientService } from '../../../services/patient.service';
import { PatientsTable } from './PatientsTable';

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        // Consumimos el servicio estandarizado que creaste
        const data = await PatientService.getAll();
        setPatients(data);
      } catch (err: any) {
        setError(err.message || 'Error de conexión con el servidor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Directorio de Pacientes</h1>
        <button className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">
          + Nuevo Paciente
        </button>
      </div>

      {error && <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</div>}

      <PatientsTable patients={patients} isLoading={isLoading} />
    </div>
  );
};
