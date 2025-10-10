import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import SEO from '../components/SEO';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import PostCard, { PostCardSkeleton } from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import type { Post } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('No se pudieron cargar los artículos. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(posts.map(p => p.category).filter(Boolean));
    return Array.from(uniqueCategories) as string[];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'Todos') return posts;
    return posts.filter(p => p.category === activeCategory);
  }, [posts, activeCategory]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
    }
    if (posts.length === 0) {
      return (
        <div className="text-center text-theme-text bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">No hay artículos publicados todavía.</h3>
          <p>¡Vuelve pronto para leer nuestras novedades y consejos!</p>
        </div>
      );
    }
    if (filteredPosts.length === 0) {
      return (
        <div className="text-center text-theme-text p-6">
          <h3 className="font-semibold text-lg">No se encontraron artículos en esta categoría.</h3>
        </div>
      );
    }

    return (
      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredPosts.map(post => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      <SEO
        title="Blog - Guía de Belleza y Depilación Láser | Centro de Belleza"
        description="Explorá nuestro blog para encontrar consejos, guías y respuestas a tus preguntas sobre depilación láser definitiva, cuidados de la piel y las últimas tecnologías en estética."
        keywords="blog depilación láser, duele la depilación definitiva, consejos depilación, cuidados de la piel, depilación soprano ice, preguntas frecuentes depilación"
        ogImage="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/blog_og.jpg"
      />
      <section className="pt-32 pb-20 animated-gradient-background-soft">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <AnimatedTitle as="h1" className="text-4xl md:text-5xl font-bold text-theme-text-strong">
              Guía de Belleza Definitiva
            </AnimatedTitle>
            <p className="text-lg text-theme-text mt-4 max-w-2xl mx-auto">
              Tu espacio para resolver dudas, aprender sobre cuidados y conocer a fondo la depilación láser.
            </p>
            <div className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></div>
          </div>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
          {renderContent()}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
