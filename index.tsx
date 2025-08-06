import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Use environment variable for Site Key in production, with a fallback to Google's test key for development.
const RECAPTCHA_V3_SITE_KEY = process.env.RECAPTCHA_V3_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_V3_SITE_KEY}>
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);