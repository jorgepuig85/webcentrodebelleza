
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { supabase } from '../lib/supabaseClient';
import { AppointmentConfirmationEmail } from '../emails/AppointmentConfirmation';
import { AdminNotificationEmail } from '../emails/AdminNotification';
import React from 'react';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    // --- Environment Variable Initialization ---
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmailsEnv = process.env.ADMIN_EMAIL;
    const fromEmail = 'Centro de Belleza <onboarding@resend.dev>';
    
    // Initialize Resend only if the key is available
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    // --- Request Body Validation ---
    const { name, email, phone, date, time, zones, message } = req.body as {
        name: string;
        email: string;
        phone?: string;
        date: string;
        time: string;
        zones: string[];
        message?: string;
    };
    if (!name || !email || !date || !time || !Array.isArray(zones) || zones.length === 0) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'El formato del email no es válido.' });
    }

    try {
        // 1. Re-verify availability in both tables to prevent race conditions
        // Switched to sequential awaits to avoid a TypeScript type inference issue with Promise.all and the Supabase client library.
        const { data: existingAppointment, error: appointmentsError } = await supabase.from('appointments').select('id').eq('date', date).eq('start_time', `${time}:00`).maybeSingle();
        const { data: existingWebAppoinment, error: webAppointmentsError } = await supabase.from('web_appointments').select('id').eq('date', date).eq('time', time).maybeSingle();

        if (appointmentsError) throw appointmentsError;
        if (webAppointmentsError) throw webAppointmentsError;

        if (existingAppointment || existingWebAppoinment) {
            return res.status(409).json({ error: 'Este horario acaba de ser reservado. Por favor, elegí otro.' });
        }
        
        // 2. Insert into web_appointments table
        const { data: newAppointment, error: insertError } = await supabase
            .from('web_appointments')
            .insert([{ 
                name, 
                email, 
                phone: phone ?? null, 
                date, 
                time, 
                zones, 
                message: message ?? null, 
                status: 'pendiente' 
            }])
            .select()
            .single();

        if (insertError) {
             throw new Error(`Supabase insert error: ${insertError.message}`);
        }

        // 3. Send notification emails (only if Resend and admin emails are configured)
        if (resend && adminEmailsEnv) {
            // Split the comma-separated string into an array of emails
            const adminEmailList = adminEmailsEnv.split(',').map(e => e.trim()).filter(Boolean);

            if (adminEmailList.length > 0) {
                try {
                    await Promise.all([
                        // Email to client
                        resend.emails.send({
                            from: fromEmail,
                            to: email,
                            subject: 'Solicitud de turno recibida - Centro de Belleza',
                            react: React.createElement(AppointmentConfirmationEmail, { name, date, time, zones }),
                        }),
                        // Email to admin(s)
                        resend.emails.send({
                            from: fromEmail,
                            to: adminEmailList,
                            subject: `Nueva solicitud de turno de ${name} para el ${date}`,
                            react: React.createElement(AdminNotificationEmail, { name, email, phone, date, time, zones, message }),
                        })
                    ]);
                } catch (emailError) {
                    // Log email error but don't fail the request since booking was successful
                    console.error("Failed to send emails (booking is still saved):", emailError);
                }
            } else {
                 console.warn('Email sending skipped: ADMIN_EMAIL is set but contains no valid email addresses.');
            }
        } else {
            console.warn('Email sending skipped: Resend API Key or Admin Email not configured in environment.');
        }


        return res.status(201).json({ success: true, message: 'Appointment requested successfully!', appointment: newAppointment });

    } catch (error: any) {
        console.error('Error booking appointment:', error);
        return res.status(500).json({ error: 'No se pudo agendar el turno.', details: error.message });
    }
}