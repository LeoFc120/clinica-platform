import { useEffect, useState, useCallback } from 'react';
import { type Patient, PatientService } from '../../services/patient.service';
import { PatientsTable } from '../../components/Patients/PatientsTable';
import { PatientForm } from '../../components/Patients/PatientForm';

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

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

  const handleStartCreate = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleStartEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este paciente?')) {
      try {
        await PatientService.delete(id);
        fetchPatients();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el paciente');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPatient(null);
    fetchPatients();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Directorio de Pacientes</h1>
        {!showForm && (
          <button
            onClick={handleStartCreate}
            className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            + Nuevo Paciente
          </button>
        )}
      </div>

      {error && <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</div>}

      {showForm ? (
        <PatientForm
          patientToEdit={editingPatient}
          onCancel={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <PatientsTable
          patients={patients}
          isLoading={isLoading}
          onEdit={handleStartEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
