import { MainLayout } from './components/layout/MainLayout';
import { PatientsPage } from './components/layout/Patients/PatientsPage';

function App() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100">
        <PatientsPage />
      </div>
    </MainLayout>
  );
}

export default App;
