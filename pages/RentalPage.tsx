import React from 'react';
import Rental from '../components/Rental';
import SEO from '../components/SEO';

const RentalPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Alquiler de Equipo de Depilación Láser en Santa Rosa y Miguel Riglos"
        description="Potenciá tu negocio de estética. Ofrecemos alquiler de equipos de depilación definitiva por jornada en Santa Rosa (énfasis principal) y Miguel Riglos. ¡Capacitación y soporte incluidos!"
        keywords="alquiler equipo depilación, alquiler láser, profesionales estética, Santa Rosa, Miguel Riglos, La Pampa, negocio estética, renta equipo láser"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/rental.png"
      />
      <Rental />
    </>
  );
};

export default RentalPage;
