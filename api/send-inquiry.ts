
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// --- Types ---
interface InquiryProps {
    name: string;
    whatsapp: string;
    message: string;
}

// --- Email HTML Template ---
const createInquiryEmailHtml = (props: InquiryProps) => {
    const { name, whatsapp, message } = props;

    // Basic HTML escaping to prevent XSS from user-provided content
    const escapeHtml = (unsafe: string) => {
        return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    }

    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Nueva Consulta Web</title>
    </head>
    <body style="margin: 0; padding: 0;">
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
                <h1 style="color: #4338ca; margin: 0;">Nueva Consulta desde la Web</h1>
            </div>
            <div style="padding: 20px 30px;">
                <p>Se ha recibido una nueva consulta a través del formulario web.</p>
                
                <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                    <h2 style="color: #4338ca; margin-top: 0;">Datos del Contacto</h2>
                    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
                    <p><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>
                </div>

                <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                    <h2 style="color: #4338ca; margin-top: 0;">Mensaje</h2>
                    <p style="white-space: pre-wrap; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; margin: 0;">${escapeHtml(message)}</p>
                </div>

                <div style="margin-top: 30px; padding: 15px; background-color: #fefce8; border: 1px solid #fde047; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-weight: bold; color: #854d0e;">
                    Acción Requerida: Contactar a la persona por WhatsApp.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
};


// --- reCAPTCHA Verification Helper ---
async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number }> {
    const secretKey = process.env.RECAPTCHA_V3_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;

    try {
        const response = await fetch(verificationUrl, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${token}`,
        });

        if (!response.ok) {
            throw new Error(`reCAPTCHA verification request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("reCAPTCHA verification response:", data);
        return { success: data.success, score: data.score };
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return { success: false, score: 0 };
    }
}


// --- API Handler ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }
    
    const { recaptchaToken, ...formData } = req.body;
    const { name, whatsapp, message } = formData as InquiryProps;

    // --- 1. reCAPTCHA Verification ---
    if (!recaptchaToken) {
        return res.status(400).json({ error: 'Falta el token de reCAPTCHA.' });
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
        console.warn(`reCAPTCHA verification failed. Score: ${recaptchaResult.score}`);
        return res.status(403).json({ error: 'La verificación de seguridad falló. Por favor, intente de nuevo.' });
    }
    
    // --- 2. Proceed with email logic if verification is successful ---
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmailsEnv = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'Centro de Belleza <onboarding@resend.dev>';
    
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    if (!name || !whatsapp || !message) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    try {
        if (resend && adminEmailsEnv) {
            const adminEmailList = adminEmailsEnv.split(',').map(e => e.trim()).filter(Boolean);
            const emailProps = { name, whatsapp, message };

            if (adminEmailList.length > 0) {
                await resend.emails.send({
                    from: fromEmail,
                    to: adminEmailList,
                    subject: `Nueva consulta de ${name}`,
                    html: createInquiryEmailHtml(emailProps),
                });
            } else {
                 console.warn('Envío de email omitido: ADMIN_EMAIL está configurado pero no contiene direcciones válidas.');
            }
        } else {
            console.warn('Envío de email omitido: La clave de API de Resend o el email de administrador no están configurados.');
        }

        return res.status(200).json({ success: true, message: 'Inquiry sent successfully!' });

    } catch (error: any) {
        console.error('Error sending inquiry:', error);
        return res.status(500).json({ error: 'No se pudo enviar la consulta.', details: error.message });
    }
}
