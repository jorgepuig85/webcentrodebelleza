import React, { useContext, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import AnimatedTitle from './ui/AnimatedTitle';

const SeasonalHeroEffects = lazy(() => import('./SeasonalHeroEffects').then(m => ({ default: m.SeasonalHeroEffects })));

const Hero: React.FC = () => {
    const { activeTheme } = useContext(ThemeContext);
    const baseUrl = activeTheme.images.hero.split('?')[0];

  return (
    <section id="inicio" className="relative min-h-[640px] md:min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <img
        src={baseUrl}
        alt="Fondo del centro de belleza con una mujer sonriendo"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Seasonal animations overlay */}
      <Suspense fallback={null}>
        <SeasonalHeroEffects />
      </Suspense>

      <div className="relative z-10 px-4">
        <div>
          <AnimatedTitle as="h1" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            Descubrí tu mejor piel.
          </AnimatedTitle>
        </div>

        <p className="text-base md:text-xl lg:text-2xl font-light text-white/90 mb-4 md:mb-6">
          {activeTheme.seasonalSlogan}
        </p>
        
        <p className="text-base md:text-xl max-w-2xl mx-auto mb-6 md:mb-8 font-light">
          Depilación láser definitiva con tecnología de vanguardia para resultados visibles y duraderos. Sentite libre, sentite renovada.
        </p>
        <Link 
          to="/precios"
          className="bg-white text-theme-primary px-6 py-3 text-base md:px-8 md:py-4 md:text-lg rounded-full font-bold hover:bg-theme-primary-soft hover:scale-105 active:scale-95 transition-all duration-300 group flex items-center gap-2 mx-auto seasonal-glow-hover animate-heartbeat w-fit"
          key={activeTheme.ctaText}
        >
          {activeTheme.ctaText}
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;