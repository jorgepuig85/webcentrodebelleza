import React from 'react';

interface AppointmentConfirmationEmailProps {
  name: string;
  date: string;
  time: string;
  zones: string[];
}

// Helper to format date for display
const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00-03:00'); // Assume Argentina time for formatting
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' };
    return new Intl.DateTimeFormat('es-AR', options).format(date);
};

export const AppointmentConfirmationEmail: React.FC<Readonly<AppointmentConfirmationEmailProps>> = ({
  name,
  date,
  time,
  zones,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
    <div style={{ backgroundColor: '#fdf2f8', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#db2777', margin: 0 }}>¡Hola, {name}!</h1>
    </div>
    <div style={{ padding: '20px 30px' }}>
        <p>Hemos recibido tu solicitud de turno. ¡Gracias por elegir nuestro centro de belleza!</p>
        <p>A continuación, te dejamos los detalles. <strong>Nos pondremos en contacto con vos por WhatsApp a la brevedad para confirmar definitivamente el turno.</strong></p>
        <div style={{ border: '1px solid #fbcfe8', padding: '20px', borderRadius: '8px', marginTop: '20px', backgroundColor: '#fff7fa' }}>
            <h2 style={{ color: '#db2777', marginTop: 0, borderBottom: '2px solid #fce7f3', paddingBottom: '10px', marginBottom: '15px' }}>Detalles de tu Solicitud</h2>
            <p><strong>Fecha:</strong> {formatDate(date)}</p>
            <p><strong>Hora:</strong> {time} hs</p>
            <p><strong>Zonas a tratar:</strong></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {zones.map(zone => <li key={zone}>{zone}</li>)}
            </ul>
        </div>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
        Recordá que esta es una solicitud y está sujeta a nuestra confirmación final. Si tenés alguna duda, no dudes en contactarnos.
        </p>
        <p style={{ marginTop: '20px' }}>¡Te esperamos!</p>
        <p style={{ fontWeight: 'bold', color: '#db2777' }}>El equipo de Centro de Belleza</p>
    </div>
     <div style={{ backgroundColor: '#f3f4f6', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        <p style={{margin: 0}}>Centro de Belleza &copy; {new Date().getFullYear()}</p>
    </div>
  </div>
);

export default AppointmentConfirmationEmail;
