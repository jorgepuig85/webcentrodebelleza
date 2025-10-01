
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Eye, QrCode } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import AnimatedTitle from './ui/AnimatedTitle';
import QRCodeModal from './QRCodeModal';
import Legal from './Legal';

const Footer: React.FC = () => {
  const [views, setViews] = useState<number | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  useEffect(() => {
      const fetchViews = async () => {
          try {
              const response = await fetch('/api/get-views');
              if (response.ok) {
                  const data = await response.json();
                  setViews(data.views);
              } else {
                  setViews(0);
              }
          } catch (error) {
              console.error("Failed to fetch views:", error);
              setViews(0);
          }
      };

      fetchViews();
  }, []);

  return (
    <>
      <footer className="bg-theme-text-strong text-theme-text-inverted">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Sparkles className="text-theme-primary" size={28} />
                <span className="text-xl font-bold">Centro de Belleza</span>
              </div>
              <p className="text-theme-text-light max-w-xs mx-auto md:mx-0">Depilación definitiva para sentirte libre y segura.</p>
            </div>
            <div>
              <AnimatedTitle as="h4" className="font-bold text-lg mb-4">Navegación</AnimatedTitle>
              <ul className="space-y-2">
                {NAV_LINKS.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <AnimatedTitle as="h4" className="font-bold text-lg mb-4">Seguinos</AnimatedTitle>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="https://www.instagram.com/centro_de_bellezays?igsh=N3IxanJicmJuOXc5" target="_blank" rel="noopener noreferrer" aria-label="Seguinos en Instagram" className="bg-gray-700 p-3 rounded-full hover:bg-theme-primary transition-colors"><Instagram /></a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2">
              <a 
                href="https://centrodebelleza.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-400 hover:text-white hover:underline transition-colors"
              >
                Acceso Profesional
              </a>
              <button
                onClick={() => setIsLegalModalOpen(true)}
                className="text-sm text-gray-400 hover:text-white hover:underline transition-colors"
              >
                Políticas y Términos
              </button>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white hover:underline transition-colors"
              >
                <QrCode size={16} />
                Código QR
              </button>
            </div>
            <p className="mt-4">&copy; {new Date().getFullYear()} Centro de Belleza. Todos los derechos reservados.</p>
            {views !== null && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{views.toLocaleString('es-AR')} Visitas</span>
              </div>
            )}
          </div>
        </div>
      </footer>
      <QRCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      <Legal isOpen={isLegalModalOpen} onClose={() => setIsLegalModalOpen(false)} />
    </>
  );
};

export default Footer;