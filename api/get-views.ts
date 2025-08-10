
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end('Method Not Allowed');
    }

    // Use the public anon key for this read-only operation.
    const supabaseUrl = 'https://aftweonqhxvbcujexyre.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdHdlb25xaHh2YmN1amV4eXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTE5NDAsImV4cCI6MjA2NjgyNzk0MH0.LrxEBAPtICJ55ntRtA1pzUAwOH8ukKqVbIQ63MrDpr8';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
        const { data, error } = await supabase
            .from('site_metrics')
            .select('value')
            .eq('metric_name', 'page_views')
            .single();

        // If there's an error (e.g., table not found yet), return 0.
        if (error) {
            console.warn('Could not fetch view count, returning 0.', error.message);
            return res.status(200).json({ views: 0 });
        }

        return res.status(200).json({ views: data?.value ?? 0 });
    } catch (error: any) {
        console.error('Error fetching views:', error.message);
        return res.status(500).json({ error: 'Could not fetch view count.' });
    }
}
