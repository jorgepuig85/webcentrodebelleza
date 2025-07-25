import React from 'react';
import { Sparkles, Instagram } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Sparkles className="text-pink-400" size={28} />
              <span className="text-xl font-bold">Centro de Belleza</span>
            </div>
            <p className="text-gray-400">Depilación definitiva para sentirte libre y segura.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Navegación</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.id}>
                  <button onClick={() => scrollToSection(link.id)} className="text-gray-400 hover:text-white transition-colors">{link.title}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Seguinos</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://www.instagram.com/centro_de_bellezays?igsh=N3IxanJicmJuOXc5" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-3 rounded-full hover:bg-pink-500 transition-colors"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Centro de Belleza. Todos los derechos reservados.</p>
          <p className="mt-4">
            <a 
              href="https://centrodebelleza.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-500 hover:text-white hover:underline transition-colors"
            >
              Acceso Profesional
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;