import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { X, Gift, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface Prize {
  text: string;
  isWinner: boolean;
  icon: string;
  isJackpot?: boolean;
}

// All texts are consistently capitalized. The text for "Premio Sorpresa"
// is manually split with a <br/> tag to prevent it from overlapping.
const prizes: Prize[] = [
  { text: '10% de descuento', isWinner: true, icon: '🎉' },
  { text: 'Premio<br/>Sorpresa', isWinner: true, icon: '🎁' },
  { text: '15% de descuento', isWinner: true, icon: '🎉' },
  { text: '+1 Giro', isWinner: false, icon: '🔄' },
  { text: '20% de descuento', isWinner: true, icon: '💎', isJackpot: true },
  { text: 'Sin Premio', isWinner: false, icon: '❌' },
  { text: '5% de descuento', isWinner: true, icon: '🎉' },
  { text: 'Sin Premio', isWinner: false, icon: '❌' },
];

const segmentColors = ['#fdf2f8', '#ffffff'];

// --- Helper Components (moved outside the main component to prevent re-renders) ---

const Wheel: React.FC = () => {
  const viewBoxSize = 300;
  const center = viewBoxSize / 2;
  const radius = viewBoxSize / 2;
  const segmentAngle = 360 / prizes.length;
  const segmentRadians = segmentAngle * (Math.PI / 180);
  const endX = center + radius * Math.cos(segmentRadians);
  const endY = center + radius * Math.sin(segmentRadians);
  const segmentPath = `M${center},${center} L${radius * 2},${center} A${radius},${radius} 0 0,1 ${endX},${endY} Z`;

  return (
    <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full drop-shadow-lg rounded-full" aria-label="Ruleta de premios" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <g>
        {prizes.map((_, i) => (
          <g key={`segment-${i}`} transform={`rotate(${i * segmentAngle}, ${center}, ${center})`}>
            <path d={segmentPath} fill={segmentColors[i % 2]} />
            <line x1={center} y1={center} x2={center + radius} y2={center} stroke="#fbcfe8" strokeWidth="1" />
          </g>
        ))}
      </g>
      <g>
        {prizes.map((prize, i) => {
          const midAngleDeg = (i * segmentAngle) + (segmentAngle / 2);
          const midAngleRad = midAngleDeg * (Math.PI / 180);
          const isJackpot = prize.isJackpot;
          const isNoPrize = prize.text === 'Sin Premio';
          const textRadius = radius * 0.65;
          const textX = center + textRadius * Math.cos(midAngleRad);
          const textY = center + textRadius * Math.sin(midAngleRad);
          const foWidth = 95;
          const foHeight = 55;
          const foX = textX - foWidth / 2;
          const foY = textY - foHeight / 2;
          return (
            <foreignObject key={`prize-${i}`} x={foX} y={foY} width={foWidth} height={foHeight} style={{ overflow: 'visible' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', textAlign: 'center', color: isJackpot ? '#db2777' : '#4b5563', userSelect: 'none', lineHeight: 1.2 }}>
                <div style={{ fontSize: isNoPrize ? '1.25rem' : '1.75rem', lineHeight: 1 }}>{prize.icon}</div>
                <div style={{ fontWeight: isJackpot ? 800 : 600, fontSize: isJackpot ? '1rem' : '0.8rem', marginTop: '0.2rem' }} dangerouslySetInnerHTML={{ __html: prize.text }} />
              </div>
            </foreignObject>
          );
        })}
      </g>
    </svg>
  );
};

interface PrizeResultDisplayProps {
  prizeResult: Prize | null;
  formStatus: FormStatus;
  email: string;
  whatsapp: string;
  setEmail: (value: string) => void;
  setWhatsapp: (value: string) => void;
  handleClaimSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  renderStatusMessage: () => React.ReactNode;
}

const PrizeResultDisplay: React.FC<PrizeResultDisplayProps> = React.memo(({
  prizeResult,
  formStatus,
  email,
  whatsapp,
  setEmail,
  setWhatsapp,
  handleClaimSubmit,
  onClose,
  renderStatusMessage,
}) => {
  if (!prizeResult) return null;

  const textParts = prizeResult.text.split(' ');
  const isDiscount = prizeResult.text.includes('descuento');
  
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h3 className="text-xl font-bold text-gray-800">
          {prizeResult.text === '+1 Giro' ? '¡Genial!' : prizeResult.isWinner ? '¡Felicitaciones!' : '¡Qué pena!'}
        </h3>
        <p className="text-lg text-pink-600 font-medium my-2">
          {isDiscount ? (
            <><span className="font-bold">{textParts[0]}</span> {textParts.slice(1).join(' ')}</>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: prizeResult.text }} />
          )}
        </p>
        
        {prizeResult.text === '+1 Giro' ? (
           <p className="text-sm text-gray-600">¡Tenés otra oportunidad para ganar!</p>
        ) : prizeResult.isWinner ? (
          <form onSubmit={handleClaimSubmit} className="space-y-3">
            <p className="text-sm text-gray-600">Ingresá tu email o WhatsApp para reclamar tu premio.</p>
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu.email@ejemplo.com" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
            </div>
            <div>
              <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))} placeholder="Tu número de WhatsApp" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
            </div>
            {renderStatusMessage()}
            <button type="submit" disabled={formStatus === 'loading'} className="w-full bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:bg-green-300 flex items-center justify-center gap-2">
              {formStatus === 'loading' ? <Loader2 className="animate-spin"/> : <Mail size={18} />}
              Reclamar Premio
            </button>
          </form>
        ) : (
          <button onClick={onClose} className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors">
            Cerrar
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

// --- Main Roulette Component ---

const BeautyRoulette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prizeResult, setPrizeResult] = useState<Prize | null>(null);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPrizeResult(null);
    
    const randomPrizeIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[randomPrizeIndex];
    const segmentAngle = 360 / prizes.length;
    
    setRotation(currentRotation => {
      // 1. Calculate the final target angle for the prize. The pointer is at 3 o'clock (0 deg).
      //    Prizes are laid out counter-clockwise. A positive rotation in `framer-motion` is clockwise.
      //    We need to rotate so the prize's angle lands at the 360/0 degree mark.
      const targetStopAngle = (randomPrizeIndex * segmentAngle) + (segmentAngle / 2);
      const targetVisualAngle = 360 - targetStopAngle;

      // 2. Calculate the distance from the current visual position to the target.
      const currentVisualAngle = currentRotation % 360;
      // The clockwise distance needed to travel, ensuring it's always a positive value.
      const distance = (360 - (currentVisualAngle - targetVisualAngle)) % 360;

      // 3. Add 5 full spins for visual effect.
      const spinAmount = (5 * 360) + distance;
      
      return currentRotation + spinAmount;
    });
    
    setTimeout(() => {
      setIsSpinning(false);
      setPrizeResult(selectedPrize);

      if (selectedPrize.text === '+1 Giro') {
        setTimeout(() => {
          setPrizeResult(null);
        }, 2500);
      }
    }, 5000);
  };
  
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setStatusMessage('');

    if (!email && !whatsapp) {
      setFormStatus('error');
      setStatusMessage('Por favor, ingresá tu email o tu WhatsApp.');
      return;
    }

    if (!executeRecaptcha) {
        setStatusMessage('Error de reCAPTCHA. Recargá la página.');
        setFormStatus('error');
        return;
    }
    if (!prizeResult || !prizeResult.isWinner) {
        setStatusMessage('No hay premio para reclamar.');
        setFormStatus('error');
        return;
    }

    try {
        const recaptchaToken = await executeRecaptcha('claimPrize');
        const response = await fetch('/api/claim-prize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, whatsapp, prize: prizeResult.text.replace('<br/>', ' '), recaptchaToken }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ocurrió un error.');
        }

        setFormStatus('success');
        setStatusMessage('¡Premio reclamado! Revisa tu email (si lo ingresaste) para ver los detalles.');

    } catch (error) {
        setFormStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'No se pudo conectar con el servidor. Por favor, intentá de nuevo.';
        setStatusMessage(errorMessage);
    }
  };
  
  const renderStatusMessage = () => {
    if (formStatus === 'idle' || !statusMessage) return null;
    const isSuccess = formStatus === 'success';
    const Icon = isSuccess ? CheckCircle : AlertCircle;
    const colorClass = isSuccess ? 'green' : 'red';
    return (
      <div className={`mt-2 flex items-start gap-2 text-xs text-${colorClass}-700 bg-${colorClass}-50 p-2 rounded-md`}>
        <Icon size={16} className="flex-shrink-0 mt-0.5" />
        <span>{statusMessage}</span>
      </div>
    );
  };
  
  const renderContent = () => {
    if (formStatus === 'success') {
      return (
        <div className="text-center p-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">¡Éxito!</h3>
            <p className="text-gray-600 mt-2">{statusMessage}</p>
            <button onClick={onClose} className="mt-6 w-full bg-theme-primary text-theme-text-inverted px-4 py-2 rounded-full font-semibold hover:bg-theme-primary-hover transition-colors seasonal-glow-hover">Cerrar</button>
        </div>
      );
    }

    return (
        <>
            <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-6">
                <div 
                    className="absolute top-1/2 -right-1 w-8 h-8 -translate-y-1/2 z-10 text-pink-500"
                    style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))' }}
                >
                    <svg viewBox="0 0 100 100" fill="currentColor">
                        <polygon points="0,50 100,0 100,100" />
                    </svg>
                </div>

                <motion.div
                    className="w-full h-full"
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", damping: 15, stiffness: 20, duration: 5 }}
                >
                    <Wheel />
                </motion.div>
            </div>

            {!prizeResult && (
                <button onClick={handleSpin} disabled={isSpinning} className="w-full bg-theme-primary text-theme-text-inverted px-6 py-3 rounded-full font-bold text-lg hover:bg-theme-primary-hover disabled:bg-theme-primary/70 disabled:cursor-not-allowed flex items-center justify-center gap-2 seasonal-glow-hover">
                    {isSpinning ? <><Loader2 className="animate-spin" /> Girando...</> : <><Gift /> ¡Girar la Ruleta!</>}
                </button>
            )}
            
            <PrizeResultDisplay
              prizeResult={prizeResult}
              formStatus={formStatus}
              email={email}
              whatsapp={whatsapp}
              setEmail={setEmail}
              setWhatsapp={setWhatsapp}
              handleClaimSubmit={handleClaimSubmit}
              onClose={onClose}
              renderStatusMessage={renderStatusMessage}
            />
        </>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full relative"
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Cerrar">
              <X size={24} />
            </button>
            <div className="text-center mb-4">
              <AnimatedTitle as="h2" className="text-2xl md:text-3xl font-bold text-gray-800">Ruleta de la Belleza</AnimatedTitle>
              <p className="text-gray-600 mt-1">¡Girá y ganá un premio exclusivo!</p>
            </div>
            
            {renderContent()}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BeautyRoulette;