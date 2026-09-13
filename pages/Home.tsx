
import React, { Suspense, lazy } from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import LazySection from '../components/ui/LazySection';

const ServicesPreview = lazy(() => import('../components/ServicesPreview'));
const PromotionsPreview = lazy(() => import('../components/PromotionsPreview'));
const TechnologyPreview = lazy(() => import('../components/TechnologyPreview'));
const TestimonialsPreview = lazy(() => import('../components/TestimonialsPreview'));
const LocationsPreview = lazy(() => import('../components/LocationsPreview'));

const Home: React.FC = () => {
  return (
    <>
      <SEO 
        title="Depilación Láser Definitiva en Santa Rosa y Miguel Riglos | Centro de Belleza"
        description="Líderes en depilación láser definitiva Soprano Ice en Santa Rosa y Miguel Riglos. Descubrí el mejor tratamiento para eliminar vello. ¡Consultá precios y reservá tu turno!"
        keywords="depilación láser Santa Rosa, depilación definitiva Santa Rosa, centro de estética Santa Rosa, depilación soprano ice, eliminar vello, La Pampa, Miguel Riglos, mejor lugar para depilación definitiva"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/fondo_inicio_invierno.png"
      />
      <Hero />
      <LazySection fallback={<div className="min-h-[400px]" />}>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <ServicesPreview />
        </Suspense>
      </LazySection>
      <LazySection fallback={<div className="min-h-[400px]" />}>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <PromotionsPreview />
        </Suspense>
      </LazySection>
      <LazySection fallback={<div className="min-h-[400px]" />}>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <TechnologyPreview />
        </Suspense>
      </LazySection>
      <LazySection fallback={<div className="min-h-[400px]" />}>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <TestimonialsPreview />
        </Suspense>
      </LazySection>
      <LazySection fallback={<div className="min-h-[400px]" />}>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <LocationsPreview />
        </Suspense>
      </LazySection>
    </>
  );
};

export default Home;
