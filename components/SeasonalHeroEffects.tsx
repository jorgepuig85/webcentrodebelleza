import React, { useRef, useEffect, useCallback, useMemo, useState, useContext } from 'react';
import { cn } from '../lib/utils';
import { ThemeContext } from '../context/ThemeContext';

// --- TYPES AND CONFIGURATION ---

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonalHeroEffectsProps {
  intensity?: 'low' | 'medium' | 'high';
  mobileIntensityOverride?: 'low' | 'medium' | 'high';
  className?: string;
  seed?: number;
  disable?: boolean;
}

interface EffectComponentProps extends Required<Omit<SeasonalHeroEffectsProps, 'className' | 'disable'>> {
  colors: { primary: string; soft: string; };
}

const INTENSITY_MAP = {
  low: { base: 15, mobile: 8 },
  medium: { base: 30, mobile: 15 },
  high: { base: 50, mobile: 25 },
};

// --- HELPER HOOKS ---

/**
 * Hook to check for user's preference for reduced motion.
 * @returns {boolean} True if the user prefers reduced motion.
 */
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  return prefersReducedMotion;
};

/**
 * Hook to track if an element is currently in the viewport.
 * @param {React.RefObject<HTMLElement>} ref - The ref of the element to observe.
 * @returns {boolean} True if the element is in the viewport.
 */
const useInView = (ref: React.RefObject<HTMLElement>): boolean => {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return isInView;
};

/**
 * Hook to track if the page is currently visible to the user.
 * @returns {boolean} True if the page is visible.
 */
const usePageVisibility = (): boolean => {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  return isVisible;
};

// --- MATH & RANDOMNESS UTILITIES ---

/**
 * Creates a seeded pseudo-random number generator.
 * @param {number} seed - The seed for the generator.
 * @returns {() => number} A function that returns a random number between 0 and 1.
 */
const seededRandom = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// --- BASE CANVAS ANIMATION LOGIC ---

/**
 * A generic hook to manage a canvas animation loop.
 * @param draw - The function to draw a single frame.
 * @param update - The function to update the state for the next frame.
 * @param initialize - The function to set up the initial state.
 * @param isRunning - A boolean to control the animation loop.
 */
const useAnimationCanvas = (
  draw: (ctx: CanvasRenderingContext2D, state: any) => void,
  update: (canvas: HTMLCanvasElement, state: any, random: () => number) => void,
  initialize: (canvas: HTMLCanvasElement, random: () => number) => any,
  isRunning: boolean,
  seed: number
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const state = useRef<any>(null);
  const random = useMemo(() => seededRandom(seed), [seed]);

  const resizeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const { devicePixelRatio = 1 } = window;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
  }, []);

  // Initialize state and setup resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas(canvas);
    state.current = initialize(canvas, random);

    const resizeObserver = new ResizeObserver(() => {
      const currentCanvas = canvasRef.current;
      if (currentCanvas) {
        resizeCanvas(currentCanvas);
        state.current = initialize(currentCanvas, random); // Re-initialize on resize
      }
    });
    resizeObserver.observe(canvas);

    return () => resizeObserver.disconnect();
  }, [initialize, random, resizeCanvas]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isRunning) {
      if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      update(canvas, state.current, random);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx, state.current);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isRunning, draw, update, random]);

  return canvasRef;
};

// --- INDIVIDUAL SEASONAL EFFECTS ---

// 🌸 SPRING: Floating Petals
const SpringEffect: React.FC<EffectComponentProps> = ({ intensity, mobileIntensityOverride, colors, seed }) => {
  const count = useMemo(() => {
    const finalIntensity = window.innerWidth < 768 ? mobileIntensityOverride : intensity;
    return INTENSITY_MAP[finalIntensity].base;
  }, [intensity, mobileIntensityOverride]);

  const initialize = useCallback((canvas: HTMLCanvasElement, random: () => number) => {
      return Array.from({ length: count }, () => ({
        x: random() * canvas.width,
        y: random() * canvas.height,
        r: random() * 2 + 1,
        vx: (random() - 0.5) * 0.2,
        vy: random() * 0.3 + 0.1,
        opacity: random() * 0.5 + 0.2,
      }));
    }, [count]);

  const update = useCallback((canvas: HTMLCanvasElement, particles: any[], random: () => number) => {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y > canvas.height + p.r) {
        p.y = -p.r;
        p.x = random() * canvas.width;
      }
      if (p.x > canvas.width + p.r || p.x < -p.r) {
        p.vx *= -1;
      }
    });
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, particles: any[]) => {
    const dpr = window.devicePixelRatio || 1;
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, ${p.opacity})`;
      ctx.fill();
    });
  }, [colors.primary]);

  const canvasRef = useAnimationCanvas(draw, update, initialize, true, seed);
  return <canvas ref={canvasRef} className="w-full h-full" />;
};


// ☀️ SUMMER: Heat Waves
const SummerEffect: React.FC<EffectComponentProps> = ({ intensity, mobileIntensityOverride, colors, seed }) => {
    const waveCount = 3;
    
    const initialize = useCallback((canvas: HTMLCanvasElement, random: () => number) => {
        return Array.from({ length: waveCount }, (_, i) => ({
            y: (canvas.height / (waveCount + 1)) * (i + 1),
            amplitude: (random() * 0.5 + 0.5) * (canvas.height * 0.02),
            frequency: (random() * 0.2 + 0.1) * 0.01,
            speed: (random() * 0.5 + 0.2) * 0.0005,
            offset: random() * Math.PI * 2,
            opacity: random() * 0.05 + 0.02,
        }));
    }, []);

    const update = useCallback((canvas: HTMLCanvasElement, waves: any[]) => {
        waves.forEach(w => {
            w.offset += w.speed * canvas.width;
        });
    }, []);

    const draw = useCallback((ctx: CanvasRenderingContext2D, waves: any[]) => {
        const dpr = window.devicePixelRatio || 1;
        waves.forEach(w => {
            ctx.beginPath();
            ctx.moveTo(0, w.y);
            for (let x = 0; x < ctx.canvas.width; x++) {
                const y = w.y + Math.sin(x * w.frequency + w.offset) * w.amplitude;
                ctx.lineTo(x, y);
            }
            ctx.lineWidth = 1.5 * dpr;
            ctx.strokeStyle = `rgba(${parseInt(colors.soft.slice(1, 3), 16)}, ${parseInt(colors.soft.slice(3, 5), 16)}, ${parseInt(colors.soft.slice(5, 7), 16)}, ${w.opacity * 3})`;
            ctx.stroke();
        });
    }, [colors.soft]);

    const canvasRef = useAnimationCanvas(draw, update, initialize, true, seed);
    return <canvas ref={canvasRef} className="w-full h-full" />;
};


// 🍂 AUTUMN: Falling Leaves
const AutumnEffect: React.FC<EffectComponentProps> = ({ intensity, mobileIntensityOverride, colors, seed }) => {
  const count = useMemo(() => {
    const finalIntensity = window.innerWidth < 768 ? mobileIntensityOverride : intensity;
    return INTENSITY_MAP[finalIntensity].base;
  }, [intensity, mobileIntensityOverride]);
  
  const initialize = useCallback((canvas: HTMLCanvasElement, random: () => number) => {
      return Array.from({ length: count }, () => ({
        x: random() * canvas.width,
        y: random() * -canvas.height, // Start above the screen
        r: random() * 3 + 2,
        vy: random() * 0.5 + 0.2,
        vx: Math.sin(random() * Math.PI * 2),
        opacity: random() * 0.6 + 0.4,
        angle: random() * Math.PI * 2,
      }));
    }, [count]);

  const update = useCallback((canvas: HTMLCanvasElement, leaves: any[], random: () => number) => {
    leaves.forEach(l => {
      l.angle += 0.01;
      l.x += Math.sin(l.angle) * 0.3;
      l.y += l.vy;
      if (l.y > canvas.height + l.r) {
        l.y = -l.r;
        l.x = random() * canvas.width;
      }
    });
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, leaves: any[]) => {
    const dpr = window.devicePixelRatio || 1;
    leaves.forEach(l => {
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, ${l.opacity})`;
      ctx.fill();
    });
  }, [colors.primary]);

  const canvasRef = useAnimationCanvas(draw, update, initialize, true, seed);
  return <canvas ref={canvasRef} className="w-full h-full" />;
};


// ❄️ WINTER: Gentle Snow
const WinterEffect: React.FC<EffectComponentProps> = ({ intensity, mobileIntensityOverride, colors, seed }) => {
  const count = useMemo(() => {
    const finalIntensity = window.innerWidth < 768 ? mobileIntensityOverride : intensity;
    return INTENSITY_MAP[finalIntensity].base; // Snow looks better with more particles
  }, [intensity, mobileIntensityOverride]);

  const initialize = useCallback((canvas: HTMLCanvasElement, random: () => number) => {
      return Array.from({ length: count }, () => ({
        x: random() * canvas.width,
        y: random() * canvas.height,
        r: random() * 1.5 + 0.5,
        vy: random() * 0.4 + 0.1,
        opacity: random() * 0.5 + 0.3,
      }));
    }, [count]);

  const update = useCallback((canvas: HTMLCanvasElement, flakes: any[], random: () => number) => {
    flakes.forEach(f => {
      f.y += f.vy;
      if (f.y > canvas.height + f.r) {
        f.y = -f.r;
        f.x = random() * canvas.width;
      }
    });
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, flakes: any[]) => {
    const dpr = window.devicePixelRatio || 1;
    flakes.forEach(f => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${parseInt(colors.soft.slice(1, 3), 16)}, ${parseInt(colors.soft.slice(3, 5), 16)}, ${parseInt(colors.soft.slice(5, 7), 16)}, ${f.opacity})`;
      ctx.fill();
    });
  }, [colors.soft]);

  const canvasRef = useAnimationCanvas(draw, update, initialize, true, seed);
  return <canvas ref={canvasRef} className="w-full h-full" />;
};


// --- MAIN COMPONENT ---

const seasonalEffects: Record<Season, React.FC<EffectComponentProps>> = {
  spring: SpringEffect,
  summer: SummerEffect,
  autumn: AutumnEffect,
  winter: WinterEffect,
};

export const SeasonalHeroEffects: React.FC<SeasonalHeroEffectsProps> = ({
  intensity = 'medium',
  mobileIntensityOverride = 'low',
  className,
  seed = Date.now(),
  disable = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTheme, season } = useContext(ThemeContext);
  
  // Performance and Accessibility Hooks
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInView = useInView(containerRef);
  const isPageVisible = usePageVisibility();

  const EffectComponent = seasonalEffects[season as Season];

  const colors = useMemo(() => ({
      primary: activeTheme.colors['--color-primary'],
      soft: activeTheme.colors['--color-primary-soft'],
  }), [activeTheme]);

  const shouldAnimate = !disable && !prefersReducedMotion && isInView && isPageVisible;

  if (disable || prefersReducedMotion) {
    return null; // Don't render anything if disabled or reduced motion is preferred
  }

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 pointer-events-none z-0 overflow-hidden", className)}
      aria-hidden="true"
      role="presentation"
    >
      {shouldAnimate && EffectComponent && (
        <EffectComponent
          intensity={intensity}
          mobileIntensityOverride={mobileIntensityOverride}
          colors={colors}
          seed={seed}
        />
      )}
    </div>
  );
};

/*
  --- HOW TO USE ---

  This component is designed to be a self-contained, drop-in enhancement for the Hero section.

  1. INTEGRATION:
     Place the `<SeasonalHeroEffects />` component inside your Hero section's main container.
     Ensure the container has `position: relative` and `overflow: hidden`.

     Example in Hero.tsx:

     import { SeasonalHeroEffects } from './SeasonalHeroEffects';

     const Hero = () => {
       return (
         <section id="inicio" className="relative h-screen ... overflow-hidden">
           ...
           <SeasonalHeroEffects intensity="low" />
           ...
         </section>
       );
     };

  2. CUSTOMIZATION:
     - `intensity`: Controls particle count ('low', 'medium', 'high'). Default: 'medium'.
     - `mobileIntensityOverride`: Sets a different intensity for screens < 768px. Default: 'low'.
     - `disable`: A boolean to completely turn off the effect.

  3. PERFORMANCE NOTES:
     - The component automatically handles performance by only animating when visible.
     - It respects user accessibility settings (`prefers-reduced-motion`).
     - Uses the highly performant Canvas API instead of DOM manipulation.
*/