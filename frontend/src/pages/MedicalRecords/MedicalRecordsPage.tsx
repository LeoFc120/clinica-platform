import React from 'react';
import './MedicalRecordsPage.css';

export const MedicalRecordsPage: React.FC = () => {
  const patientInfo = {
    name: 'Carlos Mendoza',
    age: '35 años',
    bloodType: 'O+',
    allergies: 'Penicilina',
    chronicDiseases: 'Hipertensión controlada',
  };

  const consultations = [
    {
      id: 1,
      date: '10 de Octubre, 2026',
      doctor: 'Dr. Usuario',
      diagnosis: 'Infección de garganta',
      treatment: 'Amoxicilina 500mg por 7 días. Reposo moderado.',
    },
    {
      id: 2,
      date: '15 de Septiembre, 2026',
      doctor: 'Dr. Usuario',
      diagnosis: 'Chequeo de rutina',
      treatment: 'Mantener dieta baja en sodio. Ajuste de losartán 50mg.',
    },
  ];

  return (
    <div className="records-container">
      <div className="records-header">
        <h2>Expedientes Clínicos</h2>
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar paciente por nombre o folio..."
        />
      </div>

      <div className="patient-card">
        <h3>Paciente Seleccionado: {patientInfo.name}</h3>
        <div className="patient-info">
          <p>
            <strong>Edad:</strong> {patientInfo.age}
          </p>
          <p>
            <strong>Tipo de Sangre:</strong> {patientInfo.bloodType}
          </p>
          <p>
            <strong>Alergias:</strong> <span style={{ color: 'red' }}>{patientInfo.allergies}</span>
          </p>
          <p>
            <strong>Padecimientos crónicos:</strong> {patientInfo.chronicDiseases}
          </p>
        </div>
      </div>

      <div className="timeline">
        <div className="timeline-header">
          <h3>Historial de Consultas</h3>
          <button className="btn-primary">+ Nueva Nota Médica</button>
        </div>

        {consultations.map((cons) => (
          <div key={cons.id} className="consultation-item">
            <h4>{cons.diagnosis}</h4>
            <span>
              {cons.date} | Atendido por: {cons.doctor}
            </span>
            <p>
              <strong>Tratamiento:</strong> {cons.treatment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
