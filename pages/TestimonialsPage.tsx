
import React from 'react';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';

const TestimonialsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Opiniones y Testimonios de Clientes | Centro de Belleza"
        description="Leé las opiniones y testimonios reales de nuestras clientas. Descubrí por qué somos el mejor lugar para depilación definitiva en Santa Rosa y La Pampa."
        keywords="opiniones sobre depilación láser, testimonios depilación definitiva, resultados depilación láser, mejor lugar para depilación definitiva en Santa Rosa, clientas satisfechas, La Pampa"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/testimonios_og.jpg"
      />
      <Testimonials />
    </>
  );
};

export default TestimonialsPage;
