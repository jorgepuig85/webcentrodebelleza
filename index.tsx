import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Determine which reCAPTCHA Site Key to use based on the hostname.
// This ensures the correct key is used in production (Vercel) vs. local development,
// resolving issues where environment variables are not exposed to the browser.
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// The user's production Site Key (publicly visible).
const PRODUCTION_SITE_KEY = "6LfJ238rAAAAAD5yTobnwO2pp01zG1dHfZWY8Lsp";
// Google's test Site Key for local development.
const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const reCaptchaKey = isProduction ? PRODUCTION_SITE_KEY : TEST_SITE_KEY;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="initial-loader" aria-label="Cargando..."></div>}>
      <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleReCaptchaProvider>
    </Suspense>
  </React.StrictMode>
);