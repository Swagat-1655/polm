import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import './index.css';

// Global styles with dark theme
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    color: white;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .leaflet-container {
    background: #0f172a !important;
  }

  .leaflet-control-container {
    .leaflet-control {
      background: rgba(30, 58, 95, 0.9) !important;
      border: 1px solid rgba(16, 185, 129, 0.2) !important;
      color: white !important;
    }

    .leaflet-control-attribution {
      background: rgba(15, 23, 42, 0.9) !important;
      color: #94a3b8 !important;
      
      a {
        color: #10b981 !important;
      }
    }
  }

  .leaflet-popup {
    .leaflet-popup-content-wrapper {
      background: rgba(30, 58, 95, 0.95) !important;
      border: 1px solid rgba(16, 185, 129, 0.3) !important;
      border-radius: 8px !important;
      backdrop-filter: blur(10px);
    }

    .leaflet-popup-tip {
      background: rgba(30, 58, 95, 0.95) !important;
      border: 1px solid rgba(16, 185, 129, 0.3) !important;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

// Placeholder components for other pages
const Analytics = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', color: 'white' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '20px', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics</h2>
    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Comprehensive analytics and reporting dashboard coming soon...</p>
  </div>
);

const Alerts = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', color: 'white' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '20px', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Alerts</h2>
    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Alert management and notification system coming soon...</p>
  </div>
);

const Settings = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', color: 'white' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '20px', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Settings</h2>
    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>System configuration and preferences coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live-monitoring" element={<LiveMonitoring />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
