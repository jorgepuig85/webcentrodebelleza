
import React from 'react';
import Services from '../components/Services';
import SEO from '../components/SEO';

const ServicesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Servicios de Depilación Láser para Mujer y Hombre | Centro de Belleza"
        description="Explorá nuestros servicios de depilación láser definitiva para mujer y hombre en Santa Rosa y Miguel Riglos. Ofrecemos tratamientos para todas las zonas: piernas, cavado, axilas, rostro y depilación masculina."
        keywords="servicios depilación láser, depilación definitiva para hombres Santa Rosa, depilación láser hombre La Pampa, tratamiento láser para eliminar vello espalda, cavado, axilas, pierna entera, bozo, precios por zona depilación láser"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/servicios_og.jpg"
      />
      <Services />
    </>
  );
};

export default ServicesPage;
