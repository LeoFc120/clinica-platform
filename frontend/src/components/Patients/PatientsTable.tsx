import type { Patient } from '../../services/patient.service';

interface PatientsTableProps {
  patients: Patient[];
  isLoading: boolean;
}

export const PatientsTable = ({ patients, isLoading }: PatientsTableProps) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">Cargando información de pacientes...</div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No hay pacientes registrados en el sistema.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Apellidos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Fecha de Nacimiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {patient.firstName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {patient.lastName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(patient.dateOfBirth).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {patient.phone || 'N/A'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {patient.email || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
