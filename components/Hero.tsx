import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { SeasonalHeroEffects } from './SeasonalHeroEffects';
import AnimatedTitle from './ui/AnimatedTitle';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionLink = motion(Link);

const Hero: React.FC = () => {
    const { activeTheme } = useContext(ThemeContext);
    const baseUrl = activeTheme.images.hero.split('?')[0];

  return (
    <section id="inicio" className="relative min-h-[640px] md:min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <img
        src={`${baseUrl}?format=webp&quality=80&width=1920`}
        srcSet={`
          ${baseUrl}?format=webp&quality=75&width=480 480w,
          ${baseUrl}?format=webp&quality=75&width=800 800w,
          ${baseUrl}?format=webp&quality=80&width=1280 1280w,
          ${baseUrl}?format=webp&quality=80&width=1920 1920w
        `}
        sizes="100vw"
        alt="Fondo del centro de belleza con una mujer sonriendo"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Seasonal animations overlay */}
      <SeasonalHeroEffects />

      <MotionDiv 
        className="relative z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0, 0, 0.58, 1] }}
      >
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0, 0, 0.58, 1] }}
        >
          <AnimatedTitle as="h1" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            Descubrí tu mejor piel.
          </AnimatedTitle>
        </MotionDiv>

        <MotionP
          className="text-base md:text-xl lg:text-2xl font-light text-white/90 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0, 0, 0.58, 1] }}
          key={activeTheme.seasonalSlogan} // Re-animate when season changes
        >
          {activeTheme.seasonalSlogan}
        </MotionP>
        
        <MotionP 
          className="text-base md:text-xl max-w-2xl mx-auto mb-6 md:mb-8 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0, 0, 0.58, 1] }}
        >
          Depilación láser definitiva con tecnología de vanguardia para resultados visibles y duraderos. Sentite libre, sentite renovada.
        </MotionP>
        <MotionLink 
          to="/servicios"
          className="bg-white text-theme-primary px-6 py-3 text-base md:px-8 md:py-4 md:text-lg rounded-full font-bold hover:bg-theme-primary-soft transition-all duration-300 group flex items-center gap-2 mx-auto seasonal-glow-hover animate-heartbeat"
          key={activeTheme.ctaText} // Add key to re-animate button text on change
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0, 0, 0.58, 1] }}
        >
          {activeTheme.ctaText}
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </MotionLink>
      </MotionDiv>
    </section>
  );
};

export default Hero;