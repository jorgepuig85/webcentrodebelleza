
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
    // This effect runs once when the app is first loaded.
    // We'll call our API to log the page visit.
    // This is a "fire-and-forget" call; we don't need the response.
    const trackVisit = async () => {
      try {
        await fetch('/api/track-visit', { method: 'POST' });
      } catch (error) {
        // Log error for debugging, but don't bother the user.
        console.error('Could not track visit:', error);
      }
    };

    trackVisit();
  }, []); // Empty dependency array ensures it runs only once.

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
