import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RoutesConfig from './RoutesConfig';
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Futuro: AuthProvider */}
        <RoutesConfig />
    </BrowserRouter>
  </React.StrictMode>,
);
