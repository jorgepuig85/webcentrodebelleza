

import React from 'react';
import { MessageCircle } from 'lucide-react'; // Using MessageCircle as a stand-in for WhatsApp icon

const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/5492954391448?text=Hola!%20Quisiera%20hacer%20una%20consulta."
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
};

export default FloatingWhatsApp;