import React, { useEffect, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { ThemeProvider } from './context/ThemeContext';
import FloatingActionCluster from './components/FloatingActionCluster';
// Lazy load non-critical components to reduce initial bundle
const BottomNavBar = lazy(() => import('./components/BottomNavBar'));

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const RentalPage = lazy(() => import('./pages/RentalPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PreciosPage = lazy(() => import('./pages/PreciosPage'));
const TechnologyPage = lazy(() => import('./pages/TechnologyPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const LocationsPage = lazy(() => import('./pages/LocationsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const PostPage = lazy(() => import('./pages/PostPage'));

const App: React.FC = () => {
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

    // If the visit has not been tracked in this session, defer the call to not block initial render.
    let visitTimer: ReturnType<typeof setTimeout> | null = null;
    if (!hasBeenTracked) {
      visitTimer = setTimeout(async () => {
        try {
          // Call our API to log the page visit. This is a "fire-and-forget" call.
          await fetch('/api/track-visit', { method: 'POST' });
          sessionStorage.setItem(visitTrackedKey, 'true');
        } catch (error) {
          console.error('Could not track visit:', error);
        }
      }, 3500);
    }

    // Cleanup timers on unmount
    return () => {
      if (visitTimer) clearTimeout(visitTimer);
    };
  }, []); // Empty dependency array ensures it runs only once.

  return (
    <ThemeProvider>
      <div className="bg-theme-background text-theme-text pb-20 md:pb-0 overflow-x-hidden">
        <Header />
        <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/precios" element={<PreciosPage />} />
                <Route path="/servicios" element={<Navigate to="/precios" replace />} />
                <Route path="/promociones" element={<Navigate to="/precios" replace />} />
                <Route path="/tecnologia" element={<TechnologyPage />} />
                <Route path="/testimonios" element={<TestimonialsPage />} />
                <Route path="/alquiler" element={<RentalPage />} />
                <Route path="/ubicaciones" element={<LocationsPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<PostPage />} />
            </Routes>
        </main>
        <Footer />
        <React.Suspense fallback={null}>
          <BottomNavBar />
        </React.Suspense>
      </div>
      <FloatingActionCluster>
        <FloatingWhatsApp />
      </FloatingActionCluster>
    </ThemeProvider>
  );
};

export default App;