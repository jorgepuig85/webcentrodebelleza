
import React from 'react';
import Contact from '../components/Contact';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Reservar Turno para Depilación Láser | Contacto | Centro de Belleza"
        description="Agendá tu turno para depilación láser definitiva en Santa Rosa o Miguel Riglos. Contactanos por WhatsApp o completá el formulario para reservar tu cita y consultar precios."
        keywords="reservar turno depilación definitiva, agendar cita estética, contacto centro de belleza, precios depilación definitiva Santa Rosa, whatsapp depilación, Santa Rosa, Miguel Riglos"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/contacto_og.jpg"
      />
      <Contact />
    </>
  );
};

export default ContactPage;
