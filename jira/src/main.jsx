import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

function clearLocalSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  console.log("Sesión local limpiada al inicio de la aplicación.");
}

clearLocalSession();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);