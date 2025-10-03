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
        title="Centro de Belleza - Depilación Definitiva en Santa Rosa y Miguel Riglos"
        description="Descubrí la mejor depilación láser definitiva en La Pampa. Tecnología de vanguardia y atención profesional en Santa Rosa y Miguel Riglos. ¡Reservá tu turno y sentite renovada!"
        keywords="depilación definitiva, depilación láser, centro de belleza, Santa Rosa, Miguel Riglos, La Pampa, estética, turnos"
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
