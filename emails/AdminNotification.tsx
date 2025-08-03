import React from 'react';

interface AdminNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  zones: string[];
  message?: string;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00-03:00'); // Assume Argentina time
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' };
    return new Intl.DateTimeFormat('es-AR', options).format(date);
};

export const AdminNotificationEmail: React.FC<Readonly<AdminNotificationEmailProps>> = ({
  name,
  email,
  phone,
  date,
  time,
  zones,
  message,
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#f1f5f9', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#4338ca', margin: 0 }}>Nueva Solicitud de Turno Web</h1>
        </div>
        <div style={{ padding: '20px 30px' }}>
            <p>Se ha recibido una nueva solicitud de turno a través del sitio web. <strong>Es necesario contactar al cliente para confirmar.</strong></p>
            
            <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
                <h2 style={{ color: '#4338ca', marginTop: 0 }}>Datos del Cliente</h2>
                <p><strong>Nombre:</strong> {name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${email}`} style={{ color: '#4338ca' }}>{email}</a></p>
                {phone && <p><strong>Teléfono/WhatsApp:</strong> {phone}</p>}
            </div>

            <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px', marginTop: '20px' }}>
                <h2 style={{ color: '#4338ca', marginTop: 0 }}>Detalles del Turno Solicitado</h2>
                <p><strong>Fecha:</strong> {formatDate(date)}</p>
                <p><strong>Hora:</strong> {time} hs</p>
                <p><strong>Zonas a tratar:</strong></p>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {zones.map(zone => <li key={zone}>{zone}</li>)}
                </ul>
                {message && (
                    <>
                        <p style={{marginTop: '15px'}}><strong>Mensaje adicional del cliente:</strong></p>
                        <p style={{ whiteSpace: 'pre-wrap', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '4px', margin: 0 }}>{message}</p>
                    </>
                )}
            </div>

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fefce8', border: '1px solid #fde047', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#854d0e' }}>
                Acción Requerida: Contactar al cliente para confirmar el turno y coordinar el pago.
                </p>
            </div>
        </div>
    </div>
);

export default AdminNotificationEmail;
