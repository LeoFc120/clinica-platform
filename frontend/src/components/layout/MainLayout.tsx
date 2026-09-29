import React from 'react';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      {/* Barra de navegación superior */}
      <header className="layout-header">
        <div className="logo">Clínica Platform</div>
        <div className="user-profile">
          <span>Dr. Usuario</span>
        </div>
      </header>

      <div className="layout-body">
        {/* Menú lateral */}
        <aside className="layout-sidebar">
          <nav>
            <ul>
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#pacientes">Pacientes</a></li>
              <li><a href="#citas">Citas Médicas</a></li>
              <li><a href="#expedientes">Expedientes</a></li>
            </ul>
          </nav>
        </aside>

        {/* Contenido principal inyectado */}
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};