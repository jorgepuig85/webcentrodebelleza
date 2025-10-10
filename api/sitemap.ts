import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Define the shape of a post we fetch from Supabase
interface Post {
  slug: string;
  created_at: string; // ISO string
}

const BASE_URL = 'https://centrodebelleza.com.ar';

// Function to generate the sitemap XML
const generateSitemap = (posts: Post[]): string => {
  const today = new Date().toISOString().split('T')[0];

  // Static pages (matching the app's routes)
  const staticPages = [
    { loc: '/', priority: '1.00', lastmod: today },
    { loc: '/servicios', priority: '0.80', lastmod: today },
    { loc: '/promociones', priority: '0.80', lastmod: today },
    { loc: '/tecnologia', priority: '0.80', lastmod: today },
    { loc: '/alquiler', priority: '0.80', lastmod: today },
    { loc: '/blog', priority: '0.90', lastmod: today },
    { loc: '/testimonios', priority: '0.80', lastmod: today },
    { loc: '/ubicaciones', priority: '0.80', lastmod: today },
    { loc: '/contacto', priority: '0.80', lastmod: today },
  ];

  // XML structure
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
    <url>
      <loc>${BASE_URL}${page.loc}</loc>
      <lastmod>${page.lastmod}</lastmod>
      <priority>${page.priority}</priority>
      <changefreq>weekly</changefreq>
    </url>
  `
    )
    .join('')}
  ${posts
    .map((post) => {
      const postLastMod = new Date(post.created_at).toISOString().split('T')[0];
      return `
    <url>
      <loc>${BASE_URL}/blog/${post.slug}</loc>
      <lastmod>${postLastMod}</lastmod>
      <priority>0.90</priority>
      <changefreq>monthly</changefreq>
    </url>
  `;
    })
    .join('')}
</urlset>`;

  return sitemap;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  // Consistent with other files in the project
  const supabaseUrl = 'https://aftweonqhxvbcujexyre.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdHdlb25xaHh2YmN1amV4eXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTE5NDAsImV4cCI6MjA2NjgyNzk0MH0.LrxEBAPtICJ55ntRtA1pzUAwOH8ukKqVbIQ63MrDpr8';
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Fetch all published posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, created_at')
      .eq('is_published', true);

    if (error) {
      throw error;
    }

    // Generate the sitemap with the fetched posts
    const sitemap = generateSitemap(posts || []);

    // Set cache headers. s-maxage for Vercel's edge cache.
    // Cache for 1 hour, and allow serving a stale version while revalidating.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.setHeader('Content-Type', 'application/xml');
    
    // Send the sitemap
    return res.status(200).send(sitemap);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).json({ error: 'Could not generate sitemap.' });
  }
}
