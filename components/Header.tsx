import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Disable body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleMobileLinkClick = (path: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 200);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-theme-background/80 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center cursor-pointer">
            <img 
              src="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/Logo.svg" 
              alt="Logo del Centro de Belleza" 
              className="h-11 w-auto" 
              width="196"
              height="44"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-theme-text hover:text-theme-primary transition-colors duration-300 font-medium whitespace-nowrap text-sm xl:text-base"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Desktop CTA Button */}
        <div className="hidden lg:flex">
          <Link to="/contacto" className="bg-theme-primary text-theme-text-inverted px-5 py-2 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover animate-heartbeat whitespace-nowrap">
            Reservar Turno
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-theme-text-strong" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu with Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* Menu Panel */}
      <div 
        className={`lg:hidden bg-theme-background shadow-lg absolute top-full left-0 right-0 px-6 pb-6 z-50 transition-all duration-300 transform origin-top ${
          isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-6 pt-4">
          {NAV_LINKS.map((link) => (
            <div key={link.path}>
              <button
                onClick={() => handleMobileLinkClick(link.path)}
                className="text-theme-text hover:text-theme-primary transition-colors duration-300 font-medium text-lg"
              >
                {link.title}
              </button>
            </div>
          ))}
          <div className="w-full mt-4">
            <button onClick={() => handleMobileLinkClick('/contacto')} className="bg-theme-primary text-theme-text-inverted w-full block text-center px-5 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover animate-heartbeat">
              Reservar Turno
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
