import React from 'react';
import Promotions from '../components/Promotions';
import SEO from '../components/SEO';

const PromotionsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Promociones en Depilación Definitiva | Centro de Belleza | La Pampa"
        description="Aprovechá nuestras promociones y combos exclusivos en depilación láser definitiva. Los mejores precios en Santa Rosa y Miguel Riglos para que te sientas increíble. ¡Consultá ahora!"
        keywords="promociones depilación, combos depilación láser, ofertas estética, descuentos, precios depilación, Santa Rosa, Miguel Riglos"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/promociones_og.jpg"
      />
      <Promotions />
    </>
  );
};

export default PromotionsPage;
