
import React from 'react';
import { motion as fm } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        }
    };

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/fondo_inicio.png?format=webp&quality=80" 
          alt="Fondo del centro de belleza con una mujer sonriendo" 
          className="w-full h-full object-cover" 
          width="1920"
          height="1080"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <fm.div 
        className="relative z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0, 0, 0.58, 1] }}
      >
        <fm.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0, 0, 0.58, 1] }}
        >
          Descubrí tu mejor piel.
        </fm.h1>
        <fm.p 
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0, 0, 0.58, 1] }}
        >
          Depilación láser definitiva con tecnología de vanguardia para resultados visibles y duraderos. Sentite libre, sentite renovada.
        </fm.p>
        <fm.button 
          onClick={() => scrollToSection('servicios')}
          className="bg-white text-pink-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-100 transition-all duration-300 hover:scale-105 group flex items-center gap-2 mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0, 0, 0.58, 1] }}
        >
          Ver Servicios
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </fm.button>
      </fm.div>
    </section>
  );
};

export default Hero;