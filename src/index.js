import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProvider from './contexts/AppProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
    <AppProvider>
    <App />
    </AppProvider>
    </AppProvider>
  </React.StrictMode>
);