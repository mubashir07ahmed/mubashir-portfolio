import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './theme.css';
import './portfolio-intro.css';
import './nav-dock.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
