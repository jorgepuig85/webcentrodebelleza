import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Always use clean URLs with BrowserRouter so that Vercel preview and production URLs never inject '#' hashes.
const Router = BrowserRouter;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="initial-loader" aria-label="Cargando..."></div>}>
      <Router>
        <App />
      </Router>
    </Suspense>
  </React.StrictMode>
);