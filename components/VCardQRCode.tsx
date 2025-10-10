import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

interface VCardQRCodeProps {
  photoUrl: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  company: string;
  website: string;
  fgColor?: string;
  logoUrl?: string;
}

const VCardQRCode: React.FC<VCardQRCodeProps> = ({
  photoUrl,
  name,
  title,
  phone,
  email,
  company,
  website,
  fgColor = '#1f2937', // Default black
  logoUrl,
}) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  // vCard Format
  const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
TITLE:${title}
PHOTO;VALUE=URL:${photoUrl}
TEL;TYPE=WORK,VOICE:${phone}
EMAIL:${email}
URL:${website}
ADR;TYPE=WORK:;;Neuquen 560;Miguel Riglos;La Pampa;8207;Argentina
END:VCARD`;

  const handleDownload = () => {
    if (!qrCodeRef.current) return;

    const svgElement = qrCodeRef.current.querySelector('svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const qrImage = new Image();
    qrImage.onload = () => {
      // Set canvas to a higher resolution for better quality
      const scale = 2;
      canvas.width = qrImage.width * scale;
      canvas.height = qrImage.height * scale;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      // Draw a white background first
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, qrImage.width, qrImage.height);

      // Draw the QR code (from SVG) onto the canvas
      ctx.drawImage(qrImage, 0, 0);
      URL.revokeObjectURL(url); // Clean up blob URL

      const finishDownload = () => {
        // Reset transform before exporting to get the high-res image
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${name.replace(/\s+/g, '_')}-vcard-qr.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      if (logoUrl) {
        // Load and draw the logo on top of the canvas
        const logoImage = new Image();
        logoImage.crossOrigin = 'anonymous'; // Required for cross-origin images
        logoImage.onload = () => {
          const logoSize = 32; // Logo size within the QR
          const logoBgSize = logoSize + 6; // Padding around the logo
          const x = (qrImage.width - logoBgSize) / 2;
          const y = (qrImage.height - logoBgSize) / 2;
          
          // Draw a white background behind the logo to ensure QR readability
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y, logoBgSize, logoBgSize);
          ctx.drawImage(logoImage, x + 3, y + 3, logoSize, logoSize);

          finishDownload();
        };
        logoImage.src = logoUrl;
      } else {
        // If no logo, just download the QR
        finishDownload();
      }
    };
    qrImage.src = url;
  };

  return (
    <motion.div 
      className="bg-theme-background p-6 rounded-lg shadow-lg text-center flex flex-col items-center border-t-2 border-theme-primary"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <img
        src={photoUrl}
        alt={`Foto de ${name}`}
        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-theme-primary-soft shadow-md"
        width="96"
        height="96"
        loading="lazy"
        decoding="async"
      />
      <AnimatedTitle as="h4" className="text-xl font-bold text-theme-text-strong">{name}</AnimatedTitle>
      <p className="text-theme-primary font-medium mb-4">{title}</p>
      
      <div className="bg-white p-4 rounded-md inline-block border shadow-inner mb-4">
        <div ref={qrCodeRef} className="relative w-[160px] h-[160px]">
            <QRCode
                value={vCardString}
                size={160}
                level="H" // High error correction for logo overlay
                bgColor="#FFFFFF"
                fgColor={fgColor}
            />
            {logoUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-1 rounded-sm shadow-md">
                        <img
                            src={logoUrl}
                            alt="Logo del Centro de Belleza"
                            className="w-8 h-8" // 32px
                        />
                    </div>
                </div>
            )}
        </div>
      </div>

      <p className="text-sm text-theme-text mb-5 max-w-xs">Escaneá el código para agregar mi contacto a tu celular.</p>

      <button
        onClick={handleDownload}
        className="mt-auto w-full flex items-center justify-center gap-2 bg-theme-primary text-theme-text-inverted px-4 py-2 rounded-full font-semibold hover:bg-theme-primary-hover transition-colors seasonal-glow-hover"
      >
        <Download size={18} />
        Descargar QR
      </button>
    </motion.div>
  );
};

export default VCardQRCode;