import { createClient } from '@supabase/supabase-js';

// Datos de conexión a Supabase
const supabaseUrl = 'https://aftweonqhxvbcujexyre.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdHdlb25xaHh2YmN1amV4eXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTE5NDAsImV4cCI6MjA2NjgyNzk0MH0.LrxEBAPtICJ55ntRtA1pzUAwOH8ukKqVbIQ63MrDpr8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
