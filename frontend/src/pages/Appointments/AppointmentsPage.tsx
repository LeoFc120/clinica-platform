import React from 'react';
import './AppointmentsPage.css';

export const AppointmentsPage: React.FC = () => {
  const appointments = [
    {
      id: 1,
      time: '09:00 AM',
      patient: 'María López',
      type: 'Primera vez',
      doctor: 'Dr. Usuario',
      status: 'Pendiente',
    },
    {
      id: 2,
      time: '10:30 AM',
      patient: 'Carlos Mendoza',
      type: 'Seguimiento',
      doctor: 'Dr. Usuario',
      status: 'Confirmada',
    },
    {
      id: 3,
      time: '12:00 PM',
      patient: 'Ana Ramírez',
      type: 'Urgencia',
      doctor: 'Dr. Usuario',
      status: 'En sala',
    },
    {
      id: 4,
      time: '04:00 PM',
      patient: 'Roberto Gómez',
      type: 'Estudios',
      doctor: 'Dr. Usuario',
      status: 'Cancelada',
    },
  ];

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2>Agenda de Citas Médicas</h2>
        <button className="btn-primary">+ Agendar Nueva Cita</button>
      </div>

      <div className="filters-bar">
        <input type="date" defaultValue="2026-10-15" />
        <select>
          <option>Todos los médicos</option>
          <option>Dr. Usuario</option>
        </select>
        <select>
          <option>Todos los estados</option>
          <option>Pendiente</option>
          <option>Confirmada</option>
          <option>En sala</option>
          <option>Cancelada</option>
        </select>
      </div>

      <div className="appointments-grid">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Tipo de Consulta</th>
              <th>Médico</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td>{apt.time}</td>
                <td>{apt.patient}</td>
                <td>{apt.type}</td>
                <td>{apt.doctor}</td>
                <td>
                  <span className={`status-badge ${apt.status.toLowerCase().replace(' ', '-')}`}>
                    {apt.status}
                  </span>
                </td>
                <td>
                  <button className="btn-action">Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
