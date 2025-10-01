import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const MotionDiv = motion.div;

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
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <Sparkles className="text-theme-primary" size={28} />
          <span className="text-xl font-bold text-theme-text-strong">Centro de Belleza</span>
        </Link>
        
        {/* Desktop Navigation Group */}
        <div className="hidden md:flex items-center">
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-theme-text hover:text-theme-primary transition-colors duration-300 font-medium"
              >
                {link.title}
              </Link>
            ))}
          </nav>
          <div className="ml-8">
            <Link to="/contacto" className="bg-theme-primary text-theme-text-inverted px-5 py-2 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover animate-heartbeat whitespace-nowrap">
              Reservar Turno
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-theme-text-strong" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
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
                <MotionDiv key={link.path} variants={menuItemVariants}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-theme-text hover:text-theme-primary transition-colors duration-300 font-medium text-lg"
                  >
                    {link.title}
                  </Link>
                </MotionDiv>
              ))}
              <MotionDiv variants={menuItemVariants} className="w-full mt-4">
                <Link to="/contacto" onClick={() => setIsMenuOpen(false)} className="bg-theme-primary text-theme-text-inverted w-full block text-center px-5 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover animate-heartbeat">
                  Reservar Turno
                </Link>
              </MotionDiv>
            </nav>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;