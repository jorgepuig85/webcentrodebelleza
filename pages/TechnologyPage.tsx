
import React from 'react';
import Technology from '../components/Technology';
import SEO from '../components/SEO';

const TechnologyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Tecnología Soprano Ice para Depilación Láser | Centro de Belleza"
        description="Conocé nuestra tecnología Soprano Ice. Un tratamiento de depilación láser definitivo, seguro, indoloro y apto para todo tipo de piel. Resultados garantizados en Santa Rosa y La Pampa."
        keywords="depilación soprano ice Santa Rosa, qué es la depilación con soprano ice, depilación láser indolora, depilación segura, tecnología depilación láser, La Pampa"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/equipo_depilacion.jpg"
      />
      <Technology />
    </>
  );
};

export default TechnologyPage;
