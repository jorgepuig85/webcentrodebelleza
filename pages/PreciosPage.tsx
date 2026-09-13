import React from 'react';
import PreciosApp from '../precios/PreciosApp';
import SEO from '../components/SEO';

const PreciosPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Precios de Depilación Láser en La Pampa | Centro de Belleza"
        description="Lista de precios y promociones actualizadas de depilación láser definitiva para mujer y hombre en Santa Rosa y Miguel Riglos."
        keywords="precios depilacion laser la pampa, costo depilacion definitiva santa rosa, tarifas depilacion laser mujer hombre"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/promociones_og.jpg"
      />
      <PreciosApp />
    </>
  );
};

export default PreciosPage;
