import React from 'react';
import Technology from '../components/Technology';
import SEO from '../components/SEO';

const TechnologyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Tecnología de Vanguardia en Depilación Láser | Centro de Belleza"
        description="Utilizamos la última tecnología en depilación láser de diodo para ofrecerte tratamientos seguros, rápidos y prácticamente indoloros en Santa Rosa y Miguel Riglos."
        keywords="tecnología depilación láser, láser diodo, tratamiento indoloro, depilación segura, soprano ice, Santa Rosa, Miguel Riglos"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/equipo_depilacion.jpg"
      />
      <Technology />
    </>
  );
};

export default TechnologyPage;
