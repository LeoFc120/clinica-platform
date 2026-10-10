import { MainLayout } from './components/layout/MainLayout';

function App() {



  return (
    <MainLayout>
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <h2>Bienvenido a Clínica Platform</h2>
        <p>Esta es la plantilla base. Aquí se renderizarán los módulos correspondientes.</p>
      </div>
    </MainLayout>
  );
}

export default App;
