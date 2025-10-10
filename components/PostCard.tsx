import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';
import type { Post } from '../types';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const PostCardSkeleton: React.FC = () => (
  <div className="bg-theme-background rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const fallbackImage = `https://picsum.photos/seed/${post.slug}/600/400`;
  const imageUrl = post.cover_image_url ? `${post.cover_image_url}?format=webp&quality=75&width=600` : fallbackImage;
  const baseUrl = imageUrl.split('?')[0];

  return (
    <motion.div
      variants={cardVariants}
      className="bg-theme-background rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 flex flex-col"
    >
      <Link to={`/blog/${post.slug}`} className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={`Imagen de portada para ${post.title}`}
          className="w-full h-48 object-cover"
          loading="lazy"
          decoding="async"
          width="600"
          height="320"
          srcSet={`${baseUrl}?format=webp&quality=75&width=400 400w, ${baseUrl}?format=webp&quality=75&width=800 800w`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-theme-text-light mb-2">
          {post.category && (
            <span className="flex items-center gap-1.5 bg-theme-primary-soft text-theme-primary font-medium px-2 py-1 rounded">
              <Tag size={14} /> {post.category}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {formattedDate}
          </span>
        </div>
        <h3 className="text-xl font-bold text-theme-text-strong mb-2 group-hover:text-theme-primary transition-colors duration-300">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-theme-text flex-grow mb-4">{post.excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="font-semibold text-theme-primary self-start mt-auto hover:underline"
        >
          Leer más
        </Link>
      </div>
    </motion.div>
  );
};

export default PostCard;
