
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// --- Types ---
interface PrizeClaimProps {
    email?: string;
    whatsapp?: string;
    prize: string;
}

interface AdminNotificationProps extends PrizeClaimProps {
    date: string;
    expirationDate: string;
}

// --- Email HTML Templates ---

const createUserPrizeEmailHtml = ({ email, prize }: PrizeClaimProps) => {
    const year = new Date().getFullYear();
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>¡Ganaste un Premio!</title>
    </head>
    <body style="margin: 0; padding: 0;">
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #fdf2f8; padding: 20px; text-align: center;">
            <h1 style="color: #db2777; margin: 0;">¡Felicitaciones!</h1>
        </div>
        <div style="padding: 20px 30px;">
            <p>¡Gracias por participar en nuestra Ruleta de la Belleza! Has ganado un premio:</p>
            <div style="border: 1px solid #fbcfe8; padding: 20px; border-radius: 8px; margin: 20px 0; background-color: #fff7fa; text-align: center;">
                <p style="font-size: 24px; font-weight: bold; color: #db2777; margin: 0;">${prize}</p>
            </div>
            <h3 style="color: #db2777;">¿Cómo canjear tu premio?</h3>
            <p>Simplemente <strong>mencioná este premio y tu información de contacto (${email})</strong> cuando reserves tu próximo turno o nos contactes por WhatsApp.</p>
            <p style="margin-top: 15px; padding: 12px; background-color: #fefce8; border-left: 4px solid #facc15; border-radius: 4px; font-size: 14px; color: #713f12;"><strong>Importante:</strong> Tu premio tiene una validez de <strong>15 días</strong> a partir de la fecha de emisión de este correo. ¡No te olvides de usarlo!</p>
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

const createAdminLeadNotificationHtml = ({ email, whatsapp, prize, date, expirationDate }: AdminNotificationProps) => {
    const emailHtml = email ? `<p><strong>Email:</strong> <a href="mailto:${email}" style="color: #4338ca;">${email}</a></p>` : '';
    const whatsappHtml = whatsapp ? `<p><strong>WhatsApp:</strong> ${whatsapp}</p>` : '';

    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Nuevo Lead de la Ruleta</title>
    </head>
    <body style="margin: 0; padding: 0;">
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
                <h1 style="color: #4338ca; margin: 0;">Nuevo Lead: Ruleta de la Belleza</h1>
            </div>
            <div style="padding: 20px 30px;">
                <p>Se ha capturado un nuevo lead a través de la ruleta en la página web.</p>
                <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                    <h2 style="color: #4338ca; margin-top: 0;">Detalles del Lead</h2>
                    <p><strong>Fecha:</strong> ${date}</p>
                    ${emailHtml}
                    ${whatsappHtml}
                    <p><strong>Premio Ganado:</strong> ${prize}</p>
                    <p style="font-weight: bold; color: #c026d3;">Vencimiento del Premio: ${expirationDate}</p>
                </div>
                <div style="margin-top: 30px; padding: 15px; background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-weight: bold; color: #15803d;">
                    No se requiere acción inmediata, solo es una notificación.
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
        if (!response.ok) throw new Error(`reCAPTCHA request failed`);
        
        const data = await response.json();
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

    const { email, whatsapp, prize, recaptchaToken } = req.body;
    
    // --- 1. Validation & reCAPTCHA ---
    if ((!email && !whatsapp) || !prize || !recaptchaToken) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
        return res.status(403).json({ error: 'La verificación de seguridad falló.' });
    }

    // --- 2. Setup Clients ---
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmailsEnv = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'Centro de Belleza <onboarding@resend.dev>';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aftweonqhxvbcujexyre.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!serviceKey) {
        console.error('CRITICAL: SUPABASE_SERVICE_KEY is not set.');
        return res.status(500).json({ error: 'Error de configuración del servidor.' });
    }
    
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    try {
        // --- 3. Check for existing lead to prevent abuse ---
        const orFilters = [];
        if (email) {
            orFilters.push(`email.eq.${email}`);
        }
        if (whatsapp) {
            orFilters.push(`whatsapp.eq.${whatsapp}`);
        }
        
        if (orFilters.length > 0) {
            const { count, error: checkError } = await supabaseAdmin
                .from('leads')
                .select('id', { count: 'exact', head: true })
                .or(orFilters.join(','));

            if (checkError) {
                console.error('Supabase lead check error:', checkError);
                throw new Error('Error al verificar la base de datos de leads.');
            }

            if (count && count > 0) {
                return res.status(409).json({ error: 'Este email o WhatsApp ya ha sido utilizado para reclamar un premio.' });
            }
        }

        // --- 4. Save lead to Database ---
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 15);
        const expirationDateISO = expirationDate.toISOString();

        const leadData = {
            email: email || null,
            whatsapp: whatsapp || null,
            prize_won: prize,
            source: 'roulette',
            expires_at: expirationDateISO,
        };

        const { error: insertError } = await supabaseAdmin
            .from('leads')
            .insert([leadData] as any);
        
        if (insertError) {
            console.error('Supabase insert error:', insertError);
            // We can continue even if DB insert fails, sending email is more critical for user
        }

        // --- 5. Send Emails ---
        if (resend && adminEmailsEnv) {
            const adminEmailList = adminEmailsEnv.split(',').map(e => e.trim()).filter(Boolean);
            if (adminEmailList.length > 0) {
                const currentDate = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
                const expirationDateString = expirationDate.toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'America/Argentina/Buenos_Aires'
                });
                
                const emailPromises = [];

                // Email to user (only if they provided a non-empty email)
                if (email && email.trim() !== '') {
                    emailPromises.push(
                        resend.emails.send({
                            from: fromEmail,
                            to: email,
                            // FIX: Corrected typo from reply_to to replyTo
                            replyTo: adminEmailList[0],
                            subject: 'Aquí está tu premio de la Ruleta de la Belleza',
                            html: createUserPrizeEmailHtml({ email, prize }),
                        })
                    );
                }

                // Email to admin
                emailPromises.push(
                    resend.emails.send({
                        from: fromEmail,
                        to: adminEmailList,
                        subject: `Nuevo Lead de la Ruleta: ${email || whatsapp}`,
                        html: createAdminLeadNotificationHtml({ email, whatsapp, prize, date: currentDate, expirationDate: expirationDateString }),
                    })
                );
                
                await Promise.all(emailPromises);
            }
        } else {
            console.warn('Email sending skipped: Resend API Key or Admin Email not configured.');
        }
        
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error claiming prize:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({ error: 'No se pudo reclamar el premio.', details: message });
    }
}