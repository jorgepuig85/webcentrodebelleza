
import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Promotions from './components/Promotions';
import Technology from './components/Technology';
import Rental from './components/Rental';
import Testimonials from './components/Testimonials';
import Locations from './components/Locations';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

const App: React.FC = () => {
  useEffect(() => {
    // This key will be used to check if a visit has already been tracked
    // for the current browser session.
    const visitTrackedKey = 'visitTracked';

    // Check if the key exists in sessionStorage.
    const hasBeenTracked = sessionStorage.getItem(visitTrackedKey);

    // If the visit has not been tracked in this session, proceed.
    if (!hasBeenTracked) {
      const trackVisit = async () => {
        try {
          // Call our API to log the page visit. This is a "fire-and-forget" call.
          await fetch('/api/track-visit', { method: 'POST' });
          
          // After the call, set the key in sessionStorage to prevent
          // tracking on subsequent reloads within the same session.
          sessionStorage.setItem(visitTrackedKey, 'true');

        } catch (error) {
          // Log error for debugging, but don't bother the user.
          // We don't set the sessionStorage key here, so it might try again on reload.
          console.error('Could not track visit:', error);
        }
      };

      trackVisit();
    }
  }, []); // Empty dependency array ensures it runs only once on initial mount.

  return (
    <div className="bg-white text-gray-700">
      <Header />
      <main>
        <Hero />
        <Services />
        <Promotions />
        <Technology />
        <Rental />
        <Testimonials />
        <Locations />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
