
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
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
import BeautyRoulette from './components/BeautyRoulette';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  const [showRoulette, setShowRoulette] = useState(false);

  useEffect(() => {
    // This key will be used to check if a visit has already been tracked
    // for the current browser session.
    const visitTrackedKey = 'visitTracked';
    const rouletteShownKey = 'rouletteShown';

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

    // --- Roulette Logic with Remote Control ---

    let timer: ReturnType<typeof setTimeout> | null = null;
    
    // Checks the Supabase config to see if the roulette should be displayed.
    const checkRouletteStatus = async () => {
        try {
            // Fetch the 'show_roulette' setting from Supabase.
            const { data, error } = await supabase
                .from('configuration')
                .select('value')
                .eq('key', 'show_roulette')
                .single();
                
            if (error) {
                // If there's an error (e.g., table doesn't exist, RLS), log it
                // and simply don't show the roulette. This fails silently.
                console.warn('Could not fetch roulette configuration:', error.message);
                return;
            }
            
            // Check if the roulette is enabled globally AND hasn't been shown to this user before.
            if (data && data.value === true) {
                const hasRouletteBeenShown = localStorage.getItem(rouletteShownKey);
                if (!hasRouletteBeenShown) {
                    // Show the roulette after a 7-second delay to not be intrusive.
                    timer = setTimeout(() => {
                        setShowRoulette(true);
                    }, 7000);
                }
            }
        } catch (err) {
            console.error('Unexpected error checking roulette status:', err);
        }
    };
    
    checkRouletteStatus();

    // Clean up the timer if the component unmounts to prevent memory leaks.
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
    };

  }, []); // Empty dependency array ensures it runs only once on initial mount.
  
  const handleRouletteClose = () => {
    setShowRoulette(false);
    localStorage.setItem('rouletteShown', 'true');
  };

  return (
    <ThemeProvider>
      <div className="bg-theme-background text-theme-text">
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
        <BeautyRoulette isOpen={showRoulette} onClose={handleRouletteClose} />
      </div>
    </ThemeProvider>
  );
};

export default App;