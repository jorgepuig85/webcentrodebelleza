
import React from 'react';
import Promotions from '../components/Promotions';
import SEO from '../components/SEO';

const PromotionsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Promociones y Precios de Depilación Láser | Centro de Belleza"
        description="Descubrí las mejores promociones y precios en depilación láser definitiva en Santa Rosa y La Pampa. Consultá nuestras ofertas y paquetes de depilación para mujer y hombre."
        keywords="precios depilación definitiva Santa Rosa, costo de depilación láser en La Pampa, promociones depilación láser Santa Rosa, oferta depilación definitiva, paquetes depilación láser, descuento depilación, combos depilación"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/promociones_og.jpg"
      />
      <Promotions />
    </>
  );
};

export default PromotionsPage;
