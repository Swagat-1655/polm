import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress console warnings in production
if (process.env.NODE_ENV === 'production') {
  console.warn = () => {};
  console.log = () => {};
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default browser behavior
  event.preventDefault();
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
