import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const isRecaptchaProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const PRODUCTION_SITE_KEY = "6LfJ238rAAAAAD5yTobnwO2pp01zG1dHfZWY8Lsp";
const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
export const reCaptchaKey = isRecaptchaProd ? PRODUCTION_SITE_KEY : TEST_SITE_KEY;

/**
 * Lazy / Scoped reCAPTCHA Provider
 * Only mounts and injects the Google reCAPTCHA v3 script and styles when wrapped around
 * forms or components that actually require anti-spam verification (e.g. Contact, Roulette).
 * This prevents 640 KiB of unused JS and CSS from blocking the main page load on mobile!
 */
export const ScopedReCaptchaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};
