
import React from 'react';
import { motion as fm } from 'framer-motion';
import { MessageCircle } from 'lucide-react'; // Using MessageCircle as a stand-in for WhatsApp icon

const FloatingWhatsApp: React.FC = () => {
  return (
    <fm.a
      href="https://wa.me/5492954391448?text=Hola!%20Quisiera%20hacer%20una%20consulta."
      target="_blank"
      rel="noopener noreferrer"
      // Increased bottom margin from bottom-6 to bottom-20 to avoid overlapping with the reCAPTCHA badge.
      className="fixed bottom-20 right-6 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, ease: [0, 0, 0.58, 1] }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={32} />
    </fm.a>
  );
};

export default FloatingWhatsApp;