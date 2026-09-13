import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Determine which reCAPTCHA Site Key to use based on the hostname.
const isRecaptchaProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const PRODUCTION_SITE_KEY = "6LfJ238rAAAAAD5yTobnwO2pp01zG1dHfZWY8Lsp";
const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const reCaptchaKey = isRecaptchaProd ? PRODUCTION_SITE_KEY : TEST_SITE_KEY;

// Always use clean URLs with BrowserRouter so that Vercel preview and production URLs never inject '#' hashes.
const Router = BrowserRouter;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="initial-loader" aria-label="Cargando..."></div>}>
      <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
        <Router>
          <App />
        </Router>
      </GoogleReCaptchaProvider>
    </Suspense>
  </React.StrictMode>
);