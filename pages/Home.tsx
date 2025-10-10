
import React from 'react';
import Hero from '../components/Hero';
import ServicesPreview from '../components/ServicesPreview';
import PromotionsPreview from '../components/PromotionsPreview';
import TechnologyPreview from '../components/TechnologyPreview';
import TestimonialsPreview from '../components/TestimonialsPreview';
import LocationsPreview from '../components/LocationsPreview';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO 
        title="Depilación Láser Definitiva en Santa Rosa y Miguel Riglos | Centro de Belleza"
        description="Líderes en depilación láser definitiva Soprano Ice en Santa Rosa y Miguel Riglos. Descubrí el mejor tratamiento para eliminar vello. ¡Consultá precios y reservá tu turno!"
        keywords="depilación láser Santa Rosa, depilación definitiva Santa Rosa, centro de estética Santa Rosa, depilación soprano ice, eliminar vello, La Pampa, Miguel Riglos, mejor lugar para depilación definitiva"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/fondo_inicio_primavera.png"
      />
      <Hero />
      <ServicesPreview />
      <PromotionsPreview />
      <TechnologyPreview />
      <TestimonialsPreview />
      <LocationsPreview />
    </>
  );
};

export default Home;
