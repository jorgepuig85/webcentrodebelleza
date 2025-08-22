
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aftweonqhxvbcujexyre.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!serviceKey) {
        console.error('SUPABASE_SERVICE_KEY is not set.');
        // Don't send an error response to the client, just fail silently on the server
        // so the main site functionality is not affected by a tracking failure.
        return res.status(200).json({ success: true, message: 'Server configuration missing.' });
    }

    try {
        const supabaseAdmin = createClient(supabaseUrl, serviceKey);
        // Call the RPC function to atomically increment the counter.
        const { error } = await supabaseAdmin.rpc('increment_metric', { metric_name_text: 'page_views' });

        if (error) {
            throw error;
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        // Fail silently to the client to not break the user experience.
        return res.status(200).json({ success: true, message: 'An error occurred while tracking.' });
    }
}