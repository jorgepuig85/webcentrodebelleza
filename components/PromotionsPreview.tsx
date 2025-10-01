import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }
};

const PromotionCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center animate-pulse">
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
    <MotionDiv
      className="bg-theme-background rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 border-t-4 border-theme-primary"
      variants={cardVariants}
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
    </MotionDiv>
  );
};

const PromotionsPreview = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const { data: promotionsData, error: promotionsError } = await supabase
          .from('items')
          .select('id, name, price, zones')
          .eq('is_combo', true)
          .order('price', { ascending: true })
          .limit(3); // Fetch only 3 promotions for the preview

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
        
        <MotionDiv 
            className="grid lg:grid-cols-3 gap-8 mb-12"
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
