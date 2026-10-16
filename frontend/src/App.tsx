import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { PatientsPage } from './pages/Patients/PatientsPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import { AppointmentsPage } from './pages/Appointments/AppointmentsPage';
import { MedicalRecordsPage } from './pages/MedicalRecords/MedicalRecordsPage'; // Nueva importación

function App() {
  return (
    <Router>
      <MainLayout>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pacientes" element={<PatientsPage />} />
            <Route path="/citas" element={<AppointmentsPage />} />
            <Route path="/expedientes" element={<MedicalRecordsPage />} /> {/* Nueva ruta */}
          </Routes>
        </div>
      </MainLayout>
    </Router>
  );
}

export default App;
