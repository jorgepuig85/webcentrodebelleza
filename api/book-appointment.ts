
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// --- Types ---
interface EmailProps {
    name: string;
    date: string;
    time: string;
    zones: string[];
}

interface AdminEmailProps extends EmailProps {
    email: string;
    phone?: string;
    message?: string;
}

// --- Calendar & Date Helpers ---

const LOCATION = 'Neuquen 560, Miguel Riglos, La Pampa, Argentina';

// Manual date formatter to avoid Node full-icu dependency on Vercel
const formatDateForDisplay = (dateString: string): string => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const date = new Date(`${dateString}T00:00:00-03:00`); // ART is UTC-3, ensure correct date object
    const dayOfWeek = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`;
};


// Creates UTC date strings required by calendar links (e.g., 20240815T180000Z)
const getUtcDateTime = (date: string, time: string): { start: string, end: string } => {
    const startTime = new Date(`${date}T${time}:00-03:00`); // Argentina Time (ART)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Assume 1-hour duration

    const toUtcString = (d: Date) => d.toISOString().replace(/[-:.]/g, '').split('Z')[0] + 'Z';

    return {
        start: toUtcString(startTime),
        end: toUtcString(endTime),
    };
};

const createCalendarLinks = (props: EmailProps) => {
    const { name, date, time } = props;
    const { start, end } = getUtcDateTime(date, time);
    const summary = encodeURIComponent(`Turno: ${name} en Centro de Belleza`);
    const description = encodeURIComponent(`Detalles del turno para ${name}. Zonas: ${props.zones.join(', ')}.`);

    const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${start}/${end}&details=${description}&location=${encodeURIComponent(LOCATION)}`;
    const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${summary}&startdt=${start}&enddt=${end}&body=${description}&location=${encodeURIComponent(LOCATION)}`;
    
    return { googleLink, outlookLink };
};

const createIcsContent = (props: EmailProps): string => {
    const { name, date, time, zones } = props;
    const { start, end } = getUtcDateTime(date, time);
    const uid = `${start}-${name.replace(/\s+/g, '')}@centrodebelleza.com`;
    const description = `Zonas a tratar: ${zones.join(', ')}.`;
    const stamp = new Date().toISOString().replace(/[-:.]/g, '').split('Z')[0] + 'Z';

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Centro de Belleza//Solicitud de Turno//ES',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:Turno: ${name} en Centro de Belleza`,
        `DESCRIPTION:${description}`,
        `LOCATION:${LOCATION}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
};

// --- Email HTML Templates ---

const createConfirmationEmailHtml = (props: EmailProps) => {
    const { name, date, time, zones } = props;
    const { googleLink, outlookLink } = createCalendarLinks(props);
    const formattedDate = formatDateForDisplay(date);
    const zonesHtml = zones.map(zone => `<li>${zone}</li>`).join('');
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Confirmación de Solicitud de Turno</title>
    </head>
    <body style="margin: 0; padding: 0;">
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #fdf2f8; padding: 20px; text-align: center;">
            <h1 style="color: #db2777; margin: 0;">¡Hola, ${name}!</h1>
        </div>
        <div style="padding: 20px 30px;">
            <p>Hemos recibido tu solicitud de turno. ¡Gracias por elegir nuestro centro de belleza!</p>
            <p>A continuación, te dejamos los detalles. <strong>Nos pondremos en contacto con vos por WhatsApp a la brevedad para confirmar definitivamente el turno.</strong></p>
            <div style="border: 1px solid #fbcfe8; padding: 20px; border-radius: 8px; margin-top: 20px; background-color: #fff7fa;">
                <h2 style="color: #db2777; margin-top: 0; border-bottom: 2px solid #fce7f3; padding-bottom: 10px; margin-bottom: 15px;">Detalles de tu Solicitud</h2>
                <p><strong>Fecha:</strong> ${formattedDate}</p>
                <p><strong>Hora:</strong> ${time} hs</p>
                <p><strong>Zonas a tratar:</strong></p>
                <ul style="padding-left: 20px; margin: 0;">
                    ${zonesHtml}
                </ul>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
                <h3 style="color: #db2777; margin-top: 0; text-align: center;">Agregá el turno a tu calendario</h3>
                <div style="text-align: center;">
                    <a href="${googleLink}" target="_blank" style="background-color: #4285F4; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 5px;">Google Calendar</a>
                    <a href="${outlookLink}" target="_blank" style="background-color: #0072C6; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 5px;">Outlook Calendar</a>
                </div>
                 <p style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 10px;">Para Apple Calendar y otros, usá el archivo .ics adjunto a este email.</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #555;">
            Recordá que esta es una solicitud y está sujeta a nuestra confirmación final.
            </p>
            <p style="margin-top: 20px;">¡Te esperamos!</p>
            <p style="font-weight: bold; color: #db2777;">El equipo de Centro de Belleza</p>
        </div>
         <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Centro de Belleza &copy; ${year}</p>
        </div>
      </div>
    </body>
    </html>`;
};

const createAdminNotificationEmailHtml = (props: AdminEmailProps) => {
    const { name, email, phone, date, time, zones, message } = props;
    const { googleLink, outlookLink } = createCalendarLinks(props);
    const formattedDate = formatDateForDisplay(date);
    const zonesHtml = zones.map(zone => `<li>${zone}</li>`).join('');
    const phoneHtml = phone ? `<p><strong>Teléfono/WhatsApp:</strong> ${phone}</p>` : '';
    const messageHtml = message ? `
        <p style="margin-top: 15px;"><strong>Mensaje adicional del cliente:</strong></p>
        <p style="white-space: pre-wrap; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; margin: 0;">${message}</p>
    ` : '';

    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Nueva Solicitud de Turno</title>
    </head>
    <body style="margin: 0; padding: 0;">
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
                <h1 style="color: #4338ca; margin: 0;">Nueva Solicitud de Turno Web</h1>
            </div>
            <div style="padding: 20px 30px;">
                <p>Se ha recibido una nueva solicitud de turno. <strong>Es necesario contactar al cliente para confirmar.</strong></p>
                
                <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                    <h2 style="color: #4338ca; margin-top: 0;">Datos del Cliente</h2>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #4338ca;">${email}</a></p>
                    ${phoneHtml}
                </div>

                <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                    <h2 style="color: #4338ca; margin-top: 0;">Detalles del Turno Solicitado</h2>
                    <p><strong>Fecha:</strong> ${formattedDate}</p>
                    <p><strong>Hora:</strong> ${time} hs</p>
                    <p><strong>Zonas a tratar:</strong></p>
                    <ul style="padding-left: 20px; margin: 0;">
                        ${zonesHtml}
                    </ul>
                    ${messageHtml}
                </div>

                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <h3 style="color: #4338ca; margin-top: 0; text-align: center;">Acciones rápidas</h3>
                    <div style="text-align: center;">
                        <a href="${googleLink}" target="_blank" style="background-color: #4285F4; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 5px;">Añadir a Google Cal.</a>
                        <a href="${outlookLink}" target="_blank" style="background-color: #0072C6; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 5px;">Añadir a Outlook</a>
                    </div>
                </div>

                <div style="margin-top: 30px; padding: 15px; background-color: #fefce8; border: 1px solid #fde047; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-weight: bold; color: #854d0e;">
                    Acción Requerida: Contactar al cliente para confirmar el turno.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
};

// --- API Handler ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }
    
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmailsEnv = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'Centro de Belleza <onboarding@resend.dev>';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aftweonqhxvbcujexyre.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!serviceKey) {
        console.error('CRITICAL: SUPABASE_SERVICE_KEY is not set.');
        return res.status(500).json({ error: 'El servidor no está configurado para acceder a la base de datos.' });
    }

    // Create a new Supabase client with the service_role key for admin-level access
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    
    const resend = resendApiKey ? new Resend(resendApiKey) : null;
    const { name, email, phone, date, time, zones, message } = req.body as AdminEmailProps;

    if (!name || !email || !date || !time || !Array.isArray(zones) || zones.length === 0) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'El formato del email no es válido.' });
    }

    try {
        const { data: existingAppointment, error: existingAppointmentError } = await supabaseAdmin
            .from('appointments').select('id').eq('date', date).eq('start_time', `${time}:00`).maybeSingle();
        if (existingAppointmentError) throw existingAppointmentError;

        const { data: existingWebAppoinment, error: existingWebAppoinmentError } = await supabaseAdmin
            .from('web_appointments').select('id').eq('date', date).eq('time', time).maybeSingle();
        if (existingWebAppoinmentError) throw existingWebAppoinmentError;

        if (existingAppointment || existingWebAppoinment) {
            return res.status(409).json({ error: 'Este horario acaba de ser reservado. Por favor, elegí otro.' });
        }
        
        const { data: newAppointment, error: insertError } = await supabaseAdmin
            .from('web_appointments')
            .insert([{ name, email, phone: phone ?? null, date, time, zones, message: message ?? null, status: 'pendiente' }])
            .select()
            .single();

        if (insertError) {
             throw new Error(`Supabase insert error: ${insertError.message}`);
        }

        if (resend && adminEmailsEnv) {
            const adminEmailList = adminEmailsEnv.split(',').map(e => e.trim()).filter(Boolean);
            const emailProps = { name, date, time, zones };
            const adminEmailProps = { ...emailProps, email, phone, message };

            if (adminEmailList.length > 0) {
                try {
                    await Promise.all([
                        // Email to client with .ics attachment
                        resend.emails.send({
                            from: fromEmail,
                            to: email,
                            subject: 'Solicitud de turno recibida - Centro de Belleza',
                            html: createConfirmationEmailHtml(emailProps),
                            attachments: [{
                                filename: 'invitacion.ics',
                                content: createIcsContent(emailProps),
                            }],
                        }),
                        // Email to admin(s)
                        resend.emails.send({
                            from: fromEmail,
                            to: adminEmailList,
                            subject: `Nueva solicitud de turno de ${name} para el ${date}`,
                            html: createAdminNotificationEmailHtml(adminEmailProps),
                        })
                    ]);
                } catch (emailError) {
                    console.error("Fallo al enviar correos (el turno se guardó igualmente):", emailError);
                }
            } else {
                 console.warn('Envío de email omitido: ADMIN_EMAIL está configurado pero no contiene direcciones válidas.');
            }
        } else {
            console.warn('Envío de email omitido: La clave de API de Resend o el email de administrador no están configurados.');
        }

        return res.status(201).json({ success: true, message: 'Appointment requested successfully!', appointment: newAppointment });

    } catch (error: any) {
        console.error('Error booking appointment:', error);
        return res.status(500).json({ error: 'No se pudo agendar el turno.', details: error.message });
    }
}
