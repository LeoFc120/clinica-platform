import { useEffect, useState, useCallback } from 'react';
import { type Patient, PatientService } from '../../../services/patient.service';
import { PatientsTable } from './PatientsTable';
import { PatientForm } from './PatientForm'; // <-- Importamos el nuevo formulario

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nuevo estado para controlar si mostramos la tabla o el formulario
  const [showForm, setShowForm] = useState(false);

  // Usamos useCallback para poder reutilizar esta función
  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await PatientService.getAll();
      setPatients(data);
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleFormSuccess = () => {
    setShowForm(false); // Ocultamos el formulario
    fetchPatients(); // Recargamos la tabla con el nuevo paciente
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Directorio de Pacientes</h1>

        {/* El botón ahora alterna entre mostrar y ocultar el formulario */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            + Nuevo Paciente
          </button>
        )}
      </div>

      {error && <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</div>}

      {/* Condicional: Mostramos el formulario o la tabla */}
      {showForm ? (
        <PatientForm onCancel={() => setShowForm(false)} onSuccess={handleFormSuccess} />
      ) : (
        <PatientsTable patients={patients} isLoading={isLoading} />
      )}
    </div>
  );
};
