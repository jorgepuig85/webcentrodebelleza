import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '../constants';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-theme-background/80 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('inicio')}>
          <Sparkles className="text-theme-primary" size={28} />
          <span className="text-xl font-bold text-theme-text-strong">Centro de Belleza</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-theme-text hover:text-theme-primary transition-colors duration-300 font-medium">
              {link.title}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <button onClick={() => scrollToSection('contacto')} className="bg-theme-primary text-theme-text-inverted px-5 py-2 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover animate-heartbeat">
            Reservar Turno
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-theme-text-strong" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <MotionDiv 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="md:hidden bg-theme-background shadow-lg absolute top-full left-0 right-0 px-6 pb-6"
          >
            <nav className="flex flex-col items-center gap-6 pt-4">
              {NAV_LINKS.map((link) => (
                <MotionButton key={link.id} variants={menuItemVariants} onClick={() => scrollToSection(link.id)} className="text-theme-text hover:text-theme-primary transition-colors duration-300 font-medium text-lg">
                  {link.title}
                </MotionButton>
              ))}
              <MotionButton variants={menuItemVariants} onClick={() => scrollToSection('contacto')} className="bg-theme-primary text-theme-text-inverted w-full px-5 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover animate-heartbeat mt-4">
                Reservar Turno
              </MotionButton>
            </nav>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;