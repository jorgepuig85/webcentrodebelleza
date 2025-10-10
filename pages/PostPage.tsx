import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import { Calendar, Tag, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import type { Post } from '../types';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('No se ha especificado un artículo.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') { // PostgREST code for "not found"
                throw new Error('Artículo no encontrado.');
            }
            throw fetchError;
        }
        
        setPost(data);

      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'No se pudo cargar el artículo.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-theme-primary" size={48} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-6">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold text-theme-text-strong mb-2">Error al cargar el artículo</h1>
        <p className="text-theme-text mb-6">{error || 'El artículo que buscas no existe o no está disponible.'}</p>
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 bg-theme-primary text-theme-text-inverted px-6 py-3 rounded-full font-semibold hover:bg-theme-primary-hover"
        >
          <ArrowLeft size={20} />
          Volver al Blog
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const fallbackImage = `https://picsum.photos/seed/${post.slug}/1200/600`;
  const imageUrl = post.cover_image_url ? `${post.cover_image_url}?format=webp&quality=80&width=1200` : fallbackImage;
  const baseUrl = imageUrl.split('?')[0];

  return (
    <>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || ''}
        keywords={post.seo_keywords || ''}
        ogImage={imageUrl}
      />
      <article className="pt-24 pb-20">
        <header className="mb-12">
            <div className="container mx-auto px-6 text-center">
                <AnimatedTitle as="h1" className="text-3xl md:text-5xl font-bold text-theme-text-strong mb-4">
                    {post.title}
                </AnimatedTitle>
                <div className="flex justify-center items-center gap-x-6 gap-y-2 text-sm text-theme-text flex-wrap">
                    {post.category && (
                        <span className="flex items-center gap-1.5 bg-theme-primary-soft text-theme-primary font-medium px-2 py-1 rounded">
                            <Tag size={14} /> {post.category}
                        </span>
                    )}
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> Publicado el {formattedDate}
                    </span>
                </div>
            </div>
        </header>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src={imageUrl}
            alt={`Imagen de portada para ${post.title}`}
            className="w-full h-64 md:h-96 object-cover mb-12"
            srcSet={`${baseUrl}?format=webp&quality=80&width=600 600w, ${baseUrl}?format=webp&quality=80&width=1200 1200w, ${baseUrl}?format=webp&quality=80&width=1920 1920w`}
            sizes="100vw"
            fetchPriority="high"
          />
        </motion.div>

        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose lg:prose-xl max-w-none prose-headings:text-theme-text-strong prose-p:text-theme-text prose-strong:text-theme-text-strong prose-a:text-theme-primary hover:prose-a:text-theme-primary-hover">
            {/* 
              Assuming post.content is plain text or safe HTML.
              If it's Markdown, a library like 'react-markdown' would be needed.
              Using dangerouslySetInnerHTML is okay if you trust the content source (e.g., your own CMS).
            */}
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
            ) : (
                <p>Contenido no disponible.</p>
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-theme-border/50 text-center">
            <p className="text-lg text-theme-text-strong font-semibold mb-4">¿Lista para empezar tu cambio?</p>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-theme-primary text-theme-text-inverted px-8 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover"
            >
              Reservar Turno
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostPage;
