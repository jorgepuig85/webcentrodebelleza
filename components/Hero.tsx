

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { SeasonalHeroEffects } from './SeasonalHeroEffects';
import AnimatedTitle from './ui/AnimatedTitle';

const Hero: React.FC = () => {
    const { activeTheme } = useContext(ThemeContext);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        }
    };

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${activeTheme.images.hero})` }}
        role="img"
        aria-label="Fondo del centro de belleza con una mujer sonriendo"
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Seasonal animations overlay */}
      <SeasonalHeroEffects />

      <motion.div 
        className="relative z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0, 0, 0.58, 1] }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0, 0, 0.58, 1] }}
        >
          <AnimatedTitle as="h1" className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            Descubrí tu mejor piel.
          </AnimatedTitle>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl lg:text-2xl font-light text-white/90 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0, 0, 0.58, 1] }}
          key={activeTheme.seasonalSlogan} // Re-animate when season changes
        >
          {activeTheme.seasonalSlogan}
        </motion.p>
        
        <motion.p 
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0, 0, 0.58, 1] }}
        >
          Depilación láser definitiva con tecnología de vanguardia para resultados visibles y duraderos. Sentite libre, sentite renovada.
        </motion.p>
        <motion.button 
          onClick={() => scrollToSection('servicios')}
          className="bg-white text-theme-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-theme-primary-soft transition-all duration-300 group flex items-center gap-2 mx-auto seasonal-glow-hover animate-heartbeat"
          key={activeTheme.ctaText} // Add key to re-animate button text on change
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0, 0, 0.58, 1] }}
        >
          {activeTheme.ctaText}
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;