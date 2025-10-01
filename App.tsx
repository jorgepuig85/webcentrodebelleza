import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BeautyRoulette from './components/BeautyRoulette';
import { ThemeProvider } from './context/ThemeContext';
import { SeasonalCursor } from './components/SeasonalCursor';
import FloatingActionCluster from './components/FloatingActionCluster';
import Home from './pages/Home';
import RentalPage from './pages/RentalPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import PromotionsPage from './pages/PromotionsPage';
import TechnologyPage from './pages/TechnologyPage';
import TestimonialsPage from './pages/TestimonialsPage';
import LocationsPage from './pages/LocationsPage';

const App: React.FC = () => {
  const [showRoulette, setShowRoulette] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // This effect handles scrolling.
    // If there's a hash, it means we want to scroll to an anchor.
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use a slight timeout to ensure the element is rendered before scrolling.
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // If there's no hash, just scroll to the top of the page.
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Rerun this effect whenever the path or hash changes.

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

    // --- Gamification Logic ---
    let rouletteTimer: ReturnType<typeof setTimeout> | null = null;
    
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
                return;
            }
            
            const isRouletteEnabled = data?.value === true;
            const hasRouletteBeenShown = localStorage.getItem(rouletteShownKey);

            if (isRouletteEnabled && !hasRouletteBeenShown) {
                rouletteTimer = setTimeout(() => {
                    setShowRoulette(true);
                }, 7000);
            }
        } catch (err) {
            console.error('Unexpected error checking gamification status:', err);
        }
    };
    
    checkGamificationStatus();

    // Cleanup timers on unmount
    return () => {
        if (rouletteTimer) clearTimeout(rouletteTimer);
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
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/servicios" element={<ServicesPage />} />
                <Route path="/promociones" element={<PromotionsPage />} />
                <Route path="/tecnologia" element={<TechnologyPage />} />
                <Route path="/testimonios" element={<TestimonialsPage />} />
                <Route path="/alquiler" element={<RentalPage />} />
                <Route path="/ubicaciones" element={<LocationsPage />} />
                <Route path="/contacto" element={<ContactPage />} />
            </Routes>
        </main>
        <Footer />
        <BeautyRoulette isOpen={showRoulette} onClose={handleRouletteClose} />
      </div>
      <FloatingActionCluster>
        <FloatingWhatsApp />
      </FloatingActionCluster>
    </ThemeProvider>
  );
};

export default App;