
import React from 'react';
import Locations from '../components/Locations';
import SEO from '../components/SEO';

const LocationsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Ubicaciones en La Pampa | Centro de Depilación Láser"
        description="Atendemos en Santa Rosa, Miguel Riglos y toda La Pampa. Encontrá el centro de depilación láser más cercano y consultá nuestro calendario de visitas."
        keywords="depilación definitiva cerca de mi, centro de estética La Pampa, depilación láser Santa Rosa, depilación láser Miguel Riglos, ubicaciones, sucursales"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/ubicaciones_og.jpg"
      />
      <Locations />
    </>
  );
};

export default LocationsPage;
