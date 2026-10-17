import React from 'react';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  // Datos estáticos simulados para validación semestral
  const metrics = {
    totalPatients: 142,
    todayAppointments: 8,
    pendingAppointments: 3,
  };

  const todayAppointmentsList = [
    {
      id: 1,
      time: '09:00 AM',
      patient: 'María López',
      reason: 'Chequeo General',
      status: 'Pendiente',
    },
    {
      id: 2,
      time: '10:30 AM',
      patient: 'Carlos Mendoza',
      reason: 'Resultados de Laboratorio',
      status: 'Confirmada',
    },
    {
      id: 3,
      time: '12:00 PM',
      patient: 'Ana Ramírez',
      reason: 'Dolor de cabeza',
      status: 'En sala',
    },
  ];

  return (
    <div className="dashboard-container">
      <h2>Dashboard General</h2>
      <p>Bienvenido, Dr. Usuario. Resumen de actividades de hoy:</p>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Pacientes Totales</h3>
          <p className="metric-value">{metrics.totalPatients}</p>
        </div>
        <div className="metric-card">
          <h3>Citas Hoy</h3>
          <p className="metric-value">{metrics.todayAppointments}</p>
        </div>
        <div className="metric-card">
          <h3>Citas Pendientes</h3>
          <p className="metric-value">{metrics.pendingAppointments}</p>
        </div>
      </div>

      <div className="appointments-section">
        <h3>Próximas Citas</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Motivo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointmentsList.map((apt) => (
              <tr key={apt.id}>
                <td>{apt.time}</td>
                <td>{apt.patient}</td>
                <td>{apt.reason}</td>
                <td>
                  <span className={`status-badge ${apt.status.toLowerCase().replace(' ', '-')}`}>
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
