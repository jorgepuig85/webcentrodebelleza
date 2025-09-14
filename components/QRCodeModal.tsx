import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { X, Download, Share2 } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [shareText, setShareText] = useState('Compartir'); // State for button text feedback
  const siteUrl = "https://www.centrodebelleza.com.ar/";
  const logoUrl = "https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/Logo.svg";

  // Handles downloading the QR code (SVG + Logo) as a single PNG file.
  const handleDownload = () => {
    if (!qrCodeRef.current) return;

    const svgElement = qrCodeRef.current.querySelector('svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Convert SVG to a data URL
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const qrImage = new Image();
    qrImage.onload = () => {
      // 2. Draw the QR code (from SVG) onto the canvas
      canvas.width = qrImage.width;
      canvas.height = qrImage.height;
      ctx.drawImage(qrImage, 0, 0);
      URL.revokeObjectURL(url); // Clean up blob URL

      // 3. Load and draw the logo on top of the canvas
      const logoImage = new Image();
      logoImage.crossOrigin = 'anonymous'; // Required for cross-origin images
      logoImage.onload = () => {
        const logoSize = 48;
        const logoBgSize = logoSize + 8; // A bit of padding
        const x = (canvas.width - logoBgSize) / 2;
        const y = (canvas.height - logoBgSize) / 2;
        
        // Draw a white background behind the logo to ensure QR readability
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, logoBgSize, logoBgSize);
        ctx.drawImage(logoImage, x + 4, y + 4, logoSize, logoSize);

        // 4. Trigger the download of the final canvas content
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'centro-de-belleza-qr.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      logoImage.src = logoUrl;
    };
    qrImage.src = url;
  };

  // Handles sharing the site URL using the Web Share API or copying to clipboard.
  const handleShare = async () => {
    const shareData = {
      title: 'Centro de Belleza',
      text: 'Descubrí los mejores tratamientos de depilación definitiva.',
      url: siteUrl,
    };

    // Use Web Share API if available (mostly on mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User might cancel the share action, so we just log the error.
        console.error('Error al usar la API de compartir:', err);
      }
    } else {
      // Fallback to clipboard for desktop browsers
      try {
        await navigator.clipboard.writeText(siteUrl);
        setShareText('¡Enlace copiado!');
        setTimeout(() => setShareText('Compartir'), 2000); // Reset text after 2s
      } catch (err) {
        console.error('Error al copiar el enlace al portapapeles:', err);
        setShareText('Error al copiar');
        setTimeout(() => setShareText('Compartir'), 2000);
      }
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          aria-labelledby="qr-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <MotionDiv
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-theme-background rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full relative text-center"
          >
            <button 
              onClick={onClose} 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors" 
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
            
            <AnimatedTitle as="h2" id="qr-modal-title" className="text-2xl font-bold text-theme-text-strong">Compartí nuestra Web</AnimatedTitle>
            <p className="text-theme-text mt-2 mb-6">Escaneá este código para visitar o compartir la página fácilmente.</p>

            <div className="bg-white p-4 rounded-lg inline-block border shadow-inner">
               <div ref={qrCodeRef} className="relative w-[256px] h-[256px] flex items-center justify-center">
                <QRCode
                  value={siteUrl}
                  size={256}
                  level={"H"}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-1 rounded-md">
                        <img
                            src={logoUrl}
                            alt="Logo del Centro de Belleza"
                            className="w-12 h-12" // 48px
                        />
                    </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-theme-primary text-theme-text-inverted px-6 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover"
              >
                <Download size={20} />
                Descargar PNG
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 bg-theme-primary text-theme-text-inverted px-6 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover"
              >
                <Share2 size={20} />
                {shareText}
              </button>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;