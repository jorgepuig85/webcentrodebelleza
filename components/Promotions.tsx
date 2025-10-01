

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Sparkles, CheckCircle } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;
const MotionP = motion.p;

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

const headerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const
    }
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

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const titleIconMap: { [key: string]: string } = {
    'Combo Free': '✨',
    'Cuerpo Completo Mujer': '⭐',
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const { data: promotionsData, error: promotionsError } = await supabase
          .from('items')
          .select('id, name, price, zones')
          .eq('is_combo', true)
          .order('price', { ascending: true });

        if (promotionsError) throw promotionsError;

        if (promotionsData && promotionsData.length > 0) {
          const typedPromotionsData: FetchedPromotion[] = promotionsData as any;
          const uniqueZoneIds = [...new Set(typedPromotionsData.flatMap(promo => promo.zones || []))];

          let zoneNamesMap: Record<string, string> = {};
          if (uniqueZoneIds.length > 0) {
            const zonesResponse = await supabase
              .from('items')
              .select('id, name')
              .in('id', uniqueZoneIds);
            
            const { data: zonesData, error: zonesError } = zonesResponse;
            
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
        } else {
            setPromotions([]);
        }
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError('No se pudieron cargar las promociones. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <PromotionCardSkeleton key={i} />)}
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
    }
    if (promotions.length === 0) {
      return (
        <div className="text-center text-theme-text bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">No se encontraron promociones.</h3>
            <p>Asegúrese de que las promociones en la tabla <code className="bg-gray-200 px-1 rounded">items</code> de Supabase tengan el campo <code className="bg-gray-200 px-1 rounded">is_combo</code> marcado como <code className="bg-gray-200 px-1 rounded">true</code>.</p>
        </div>
      );
    }
    return (
      <MotionDiv 
        className="grid lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {promotions.map((promo) => {
          const promoTitle = promo.title;
          const icon = titleIconMap[promoTitle];
          const displayTitle = icon ? `${promoTitle} ${icon}` : promoTitle;

          return (
            <MotionDiv
              key={promo.id}
              className="bg-theme-background rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 border-t-4 border-theme-primary"
              variants={cardVariants}
            >
              <div className="bg-theme-primary-soft p-4 rounded-full mb-4">
                <Sparkles className="text-theme-primary" size={32} />
              </div>
              <AnimatedTitle as="h3" className="text-2xl font-bold text-theme-text-strong mb-4">{displayTitle}</AnimatedTitle>
              
              <ul className="mb-6 space-y-2 text-left w-full flex-grow text-theme-text">
                {promo.includes.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="text-theme-success w-5 h-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
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
        })}
      </MotionDiv>
    );
  };

  return (
    <section className="pt-32 pb-20 animated-gradient-primary-soft">
      <div className="container mx-auto px-6">
        <MotionDiv
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerContainerVariants}
        >
          <MotionDiv variants={headerItemVariants}>
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Promociones Exclusivas</AnimatedTitle>
          </MotionDiv>
          <MotionP variants={headerItemVariants} className="text-lg text-theme-text mt-2">Combiná zonas y obtené los mejores precios.</MotionP>
          <MotionDiv variants={headerItemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></MotionDiv>
        </MotionDiv>
        {renderContent()}
      </div>
    </section>
  );
};

export default Promotions;