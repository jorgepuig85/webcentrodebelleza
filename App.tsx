
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
import { SeasonalCursor } from './components/SeasonalCursor';
import SeasonalPromoIcon from './components/SeasonalPromoIcon';
import FloatingActionCluster from './components/FloatingActionCluster';

const App: React.FC = () => {
  const [showRoulette, setShowRoulette] = useState(false);
  const [showPromoIcon, setShowPromoIcon] = useState(false);

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

    // --- Gamification Logic (Roulette has priority) ---
    let rouletteTimer: ReturnType<typeof setTimeout> | null = null;
    let promoIconTimer: ReturnType<typeof setTimeout> | null = null;
    
    const checkGamificationStatus = async () => {
        try {
            const rouletteShownKey = 'rouletteShown';
            const { data, error } = await supabase
                .from('configuration')
                .select('value')
                .eq('key', 'show_roulette')
                .single();
                
            if (error) {
                console.warn('Could not fetch roulette configuration:', error.message);
                // If roulette config fails, fallback to showing promo icon
                promoIconTimer = setTimeout(() => setShowPromoIcon(true), 3000);
                return;
            }
            
            const isRouletteEnabled = data?.value === true;
            const hasRouletteBeenShown = localStorage.getItem(rouletteShownKey);

            if (isRouletteEnabled && !hasRouletteBeenShown) {
                // Priority: Show roulette, ensure promo icon is hidden.
                setShowPromoIcon(false);
                rouletteTimer = setTimeout(() => {
                    setShowRoulette(true);
                }, 7000);
            } else {
                // Fallback: Show promo icon since roulette conditions aren't met.
                promoIconTimer = setTimeout(() => {
                    setShowPromoIcon(true);
                }, 3000);
            }
        } catch (err) {
            console.error('Unexpected error checking gamification status:', err);
            // On any unexpected error, default to showing the promo icon.
            promoIconTimer = setTimeout(() => setShowPromoIcon(true), 3000);
        }
    };
    
    checkGamificationStatus();

    // Cleanup timers on unmount
    return () => {
        if (rouletteTimer) clearTimeout(rouletteTimer);
        if (promoIconTimer) clearTimeout(promoIconTimer);
    };

  }, []); // Empty dependency array ensures it runs only once.
  
  const handleRouletteClose = () => {
    setShowRoulette(false);
    localStorage.setItem('rouletteShown', 'true');
  };

  return (
    <ThemeProvider>
      <SeasonalCursor />
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
        <BeautyRoulette isOpen={showRoulette} onClose={handleRouletteClose} />
      </div>
      <FloatingActionCluster>
        <SeasonalPromoIcon 
          isVisible={showPromoIcon}
          onHide={() => setShowPromoIcon(false)}
        />
        <FloatingWhatsApp />
      </FloatingActionCluster>
    </ThemeProvider>
  );
};

export default App;
