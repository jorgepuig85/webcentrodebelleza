import React from 'react';
import Contact from '../components/Contact';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Contacto y Turnos - Centro de Belleza | Santa Rosa y Miguel Riglos"
        description="Contactanos para resolver tus dudas o agendar tu turno para depilación láser definitiva en Santa Rosa o Miguel Riglos. Podés escribirnos por WhatsApp o usar nuestro formulario."
        keywords="contacto, turnos, reservar cita, teléfono, dirección, whatsapp, formulario de contacto, Santa Rosa, Miguel Riglos"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/contacto_og.jpg"
      />
      <Contact />
    </>
  );
};

export default ContactPage;
