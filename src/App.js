import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import './styles/professional.css';

function App() {
  return (
    <div className="App min-h-screen bg-main-gradient">
      <ErrorBoundary fallbackMessage="Navigation system encountered an error">
        <Navbar />
      </ErrorBoundary>
      <main className="pt-20 pb-6">
        <ErrorBoundary fallbackMessage="Dashboard system encountered an error">
          <Dashboard />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
