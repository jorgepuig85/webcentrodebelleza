import React from 'react';
import PreciosApp from '../precios/PreciosApp';
import SEO from '../components/SEO';

const PreciosPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Servicios y Precios de Depilación Láser | Centro de Belleza"
        description="Catálogo de servicios y lista de precios actualizada de depilación láser definitiva para mujer y hombre en Santa Rosa y Miguel Riglos."
        keywords="servicios depilacion laser, precios depilacion laser la pampa, costo depilacion definitiva santa rosa, tarifas depilacion laser mujer hombre, zonas depilacion laser"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/promociones_og.jpg"
      />
      <PreciosApp />
    </>
  );
};

export default PreciosPage;
