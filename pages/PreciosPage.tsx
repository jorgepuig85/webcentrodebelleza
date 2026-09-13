import React from 'react';
import PreciosApp from '../precios/PreciosApp';
import SEO from '../components/SEO';

const PreciosPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Servicios, Precios y Promociones de Depilación Láser | Centro de Belleza"
        description="Catálogo oficial con tarifas por sesión, promociones y combos de depilación láser definitiva para mujer y hombre en Santa Rosa y Miguel Riglos, La Pampa."
        keywords="servicios depilacion laser, precios depilacion laser la pampa, promociones depilacion definitiva santa rosa, combos depilacion laser, costo depilacion definitiva, tarifas depilacion laser mujer hombre, zonas depilacion laser"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/promociones_og.jpg"
      />
      <PreciosApp />
    </>
  );
};

export default PreciosPage;
