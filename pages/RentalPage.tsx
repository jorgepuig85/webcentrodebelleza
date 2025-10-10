
import React from 'react';
import Rental from '../components/Rental';
import SEO from '../components/SEO';

const RentalPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Alquiler de Equipo de Depilación Láser en Santa Rosa, La Pampa"
        description="Potenciá tu negocio de estética. Ofrecemos alquiler de equipos de depilación definitiva por jornada en Santa Rosa y alrededores. ¡Capacitación y soporte incluidos para profesionales!"
        keywords="alquiler equipo depilación Santa Rosa, alquiler láser La Pampa, profesionales estética, negocio estética, renta equipo láser, soprano ice alquiler"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/rental.png"
      />
      <Rental />
    </>
  );
};

export default RentalPage;
