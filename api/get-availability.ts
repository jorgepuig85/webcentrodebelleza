
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Business hours configuration
const START_HOUR = 7;
const END_HOUR = 21; // Last appointment starts at 20:00

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end('Method Not Allowed');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aftweonqhxvbcujexyre.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!serviceKey) {
        console.error('CRITICAL: SUPABASE_SERVICE_KEY is not set.');
        return res.status(500).json({ error: 'El servidor no está configurado correctamente para acceder a la base de datos.' });
    }
    
    // Create a new Supabase client with the service_role key for admin-level access
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { date } = req.query;

    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'Se requiere una fecha válida en formato YYYY-MM-DD.' });
    }

    try {
        // 1. Generate all possible time slots for the day
        const allSlots = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => `${String(START_HOUR + i).padStart(2, '0')}:00`);

        // 2. Fetch all bookings for the day from all relevant tables using the admin client
        const { data: appointments, error: appointmentsError } = await supabaseAdmin.from('appointments').select('start_time').eq('date', date);
        const { data: webAppointments, error: webAppointmentsError } = await supabaseAdmin.from('web_appointments').select('time').eq('date', date);
        const { data: rentalData, error: rentalError } = await supabaseAdmin.from('rentals').select('id').lte('start_date', date).gte('end_date', date);
        
        if (appointmentsError) throw appointmentsError;
        if (webAppointmentsError) throw webAppointmentsError;
        if (rentalError) throw rentalError;

        // If there's a rental for the day, no slots are available
        if (rentalData && rentalData.length > 0) {
            return res.status(200).json({ availableSlots: [] });
        }
        
        const bookedAppointments = appointments || [];
        const bookedWebAppointments = webAppointments || [];

        const bookedTimes = new Set([
            ...bookedAppointments
                .map((a: { start_time?: string | null }) => a.start_time?.substring(0, 5))
                .filter((t): t is string => Boolean(t)),
            ...bookedWebAppointments
                .map((a: { time?: string | null }) => a.time?.substring(0, 5))
                .filter((t): t is string => Boolean(t))
        ]);

        // 3. Filter out booked slots to find what's available
        const availableSlots = allSlots.filter(slot => !bookedTimes.has(slot));

        return res.status(200).json({ availableSlots });

    } catch (error: any) {
        console.error('Error fetching availability:', error);
        return res.status(500).json({ error: 'No se pudo obtener la disponibilidad.', details: error.message });
    }
}
