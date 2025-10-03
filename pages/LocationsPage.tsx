import React from 'react';
import Locations from '../components/Locations';
import SEO from '../components/SEO';

const LocationsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Ubicaciones y Localidades de Atención | Depilación Láser en La Pampa"
        description="Encontrá nuestros puntos de atención para depilación láser definitiva. Atendemos en Santa Rosa, Miguel Riglos y más localidades de La Pampa. ¡Consultá nuestro calendario de visitas!"
        keywords="ubicaciones, centros de depilación, sucursales, La Pampa, Santa Rosa, Miguel Riglos, General Pico, Toay"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/ubicaciones_og.jpg"
      />
      <Locations />
    </>
  );
};

export default LocationsPage;
