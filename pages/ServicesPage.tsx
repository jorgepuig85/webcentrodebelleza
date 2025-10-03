import React from 'react';
import Services from '../components/Services';
import SEO from '../components/SEO';

const ServicesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Servicios de Depilación Láser | Centro de Belleza | Santa Rosa y Miguel Riglos"
        description="Conocé nuestros servicios de depilación definitiva para mujer y hombre en Santa Rosa y Miguel Riglos. Tratamientos personalizados para cada zona del cuerpo con la última tecnología."
        keywords="servicios depilación láser, tratamientos estéticos, cavado, axilas, pierna entera, bozo, depilación hombre, Santa Rosa, Miguel Riglos"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/servicios_og.jpg"
      />
      <Services />
    </>
  );
};

export default ServicesPage;
