import React from 'react';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';

const TestimonialsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Testimonios de Clientes Satisfechas | Centro de Belleza | Depilación Definitiva"
        description="Leé las opiniones y experiencias de nuestras clientas satisfechas con los resultados de la depilación láser definitiva en nuestros centros de Santa Rosa y Miguel Riglos."
        keywords="testimonios, opiniones, clientas satisfechas, resultados depilación láser, antes y después, Santa Rosa, La Pampa"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/testimonios_og.jpg"
      />
      <Testimonials />
    </>
  );
};

export default TestimonialsPage;
