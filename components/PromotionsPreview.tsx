import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, wrap } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionLink = motion(Link);

type Promotion = {
  id: string;
  title: string;
  price: number;
  includes: string[];
};

type FetchedPromotion = {
  id: string;
  name: string;
  price: number;
  zones: string[] | null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    })
};

const PromotionCardSkeleton = () => (
  <div className="w-full h-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center animate-pulse">
    <div className="bg-gray-200 p-4 rounded-full mb-4 w-20 h-20"></div>
    <div className="h-7 bg-gray-200 rounded w-3/4 mb-6"></div>
    <div className="space-y-3 w-full flex-grow mb-6">
      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
    </div>
    <div className="mt-auto w-full">
      <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
      <div className="h-12 bg-gray-200 rounded-full w-full"></div>
    </div>
  </div>
);

const PromotionCard: React.FC<{ promo: Promotion }> = ({ promo }) => {
  const titleIconMap: { [key: string]: string } = {
    'Combo Free': '✨',
    'Cuerpo Completo Mujer': '⭐',
  };
  const icon = titleIconMap[promo.title];
  const displayTitle = icon ? `${promo.title} ${icon}` : promo.title;

  return (
    <motion.div
      className="w-full h-full bg-theme-background rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 border-t-4 border-theme-primary"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-theme-primary-soft p-4 rounded-full mb-4">
        <Sparkles className="text-theme-primary" size={32} />
      </div>
      <AnimatedTitle as="h3" className="text-2xl font-bold text-theme-text-strong mb-4">{displayTitle}</AnimatedTitle>
      
      <ul className="mb-6 space-y-2 text-left w-full flex-grow text-theme-text">
        {promo.includes.slice(0, 3).map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle className="text-theme-success w-5 h-5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
        {promo.includes.length > 3 && <li className="text-sm text-center text-theme-text-light mt-2">y más...</li>}
      </ul>

      <div className="mt-auto w-full">
        <p className="text-4xl font-bold text-theme-primary mb-6">${promo.price.toLocaleString('es-AR')}</p>
        <Link 
          to="/contacto"
          className="w-full block text-center bg-theme-primary text-theme-text-inverted px-6 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover"
        >
          ¡Lo quiero!
        </Link>
      </div>
    </motion.div>
  );
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const PromotionsPreview = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovering, setIsHovering] = useState(false);

  const promoIndex = wrap(0, promotions.length, page);

  const paginate = (newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const { data: promotionsData, error: promotionsError } = await supabase
          .from('items')
          .select('id, name, price, zones')
          .eq('is_combo', true)
          .order('price', { ascending: true })
          .limit(3);

        if (promotionsError) throw promotionsError;

        if (promotionsData && promotionsData.length > 0) {
          const typedPromotionsData: FetchedPromotion[] = promotionsData as any;
          const uniqueZoneIds = [...new Set(typedPromotionsData.flatMap(promo => promo.zones || []))];

          let zoneNamesMap: Record<string, string> = {};
          if (uniqueZoneIds.length > 0) {
            const { data: zonesData, error: zonesError } = await supabase
              .from('items').select('id, name').in('id', uniqueZoneIds);
            if (zonesError) throw zonesError;
            if (zonesData) {
              zoneNamesMap = Object.fromEntries(zonesData.map(zone => [zone.id, zone.name]));
            }
          }

          const formattedPromotions: Promotion[] = typedPromotionsData.map((item) => ({
            id: item.id,
            title: item.name,
            price: item.price,
            includes: item.zones?.map((zoneId: string) => zoneNamesMap[zoneId]).filter((name): name is string => !!name) || [],
          }));
          setPromotions(formattedPromotions);
        }
      } catch (err) {
        console.error("Error fetching promotions preview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop || isHovering || loading || promotions.length <= 1) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isDesktop, isHovering, loading, promotions.length]);

  return (
    <section id="promociones" className="py-20 animated-gradient-primary-soft">
      <div className="container mx-auto px-6">
        <MotionDiv
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <MotionDiv variants={itemVariants}>
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Promociones Destacadas</AnimatedTitle>
          </MotionDiv>
          <MotionP variants={itemVariants} className="text-lg text-theme-text mt-2">Aprovechá nuestros combos y obtené los mejores precios.</MotionP>
          <MotionDiv variants={itemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></MotionDiv>
        </MotionDiv>
        
        {isDesktop ? (
          <MotionDiv 
              className="grid lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.15 }}
          >
            {loading 
              ? [...Array(3)].map((_, i) => <PromotionCardSkeleton key={i} />)
              : promotions.map((promo) => <PromotionCard key={promo.id} promo={promo} />)
            }
          </MotionDiv>
        ) : (
          <div 
            className="relative h-[550px] w-full max-w-sm mx-auto mb-12"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {loading ? <PromotionCardSkeleton /> : (
              <AnimatePresence initial={false} custom={direction}>
                <MotionDiv
                  key={page}
                  className="absolute w-full h-full"
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const power = swipePower(offset.x, velocity.x);
                    if (power < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (power > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                >
                  <PromotionCard promo={promotions[promoIndex]} />
                </MotionDiv>
              </AnimatePresence>
            )}

            {!loading && promotions.length > 1 && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {promotions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage([i, i > page ? 1 : -1])}
                    className={`w-2 h-2 rounded-full transition-colors ${i === promoIndex ? 'bg-theme-primary' : 'bg-theme-border'}`}
                    aria-label={`Ir a la promoción ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        <MotionDiv 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
            <MotionLink
                to="/promociones"
                className="inline-flex items-center gap-2 bg-theme-primary text-theme-text-inverted px-8 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover text-lg"
            >
                Ver Todas las Promociones
                <ArrowRight />
            </MotionLink>
        </MotionDiv>
      </div>
    </section>
  );
};

export default PromotionsPreview;