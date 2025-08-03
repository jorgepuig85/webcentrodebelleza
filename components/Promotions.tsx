
import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Sparkles, CheckCircle } from 'lucide-react';

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

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const { data: promotionsData, error: promotionsError } = await supabase
          .from('items')
          .select('id, name, price, zones')
          .eq('is_combo', 'TRUE')
          .order('price', { ascending: true });

        if (promotionsError) throw promotionsError;

        if (promotionsData && promotionsData.length > 0) {
          const typedPromotionsData = promotionsData as FetchedPromotion[];
          const uniqueZoneIds = [...new Set(typedPromotionsData.flatMap(promo => promo.zones || []))];

          let zoneNamesMap: Record<string, string> = {};
          if (uniqueZoneIds.length > 0) {
            const { data: zonesData, error: zonesError } = await supabase
              .from('items')
              .select('id, name')
              .in('id', uniqueZoneIds);

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
      } catch (err: any) {
        console.error("Error fetching promotions:", err);
        setError('No se pudieron cargar las promociones. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderContent = (): JSX.Element => {
    if (loading) {
      return <div className="text-center text-gray-500 py-8">Cargando promociones...</div>;
    }
    
    if (error) {
      return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
    }

    if (promotions.length === 0) {
      return (
        <div className="text-center text-gray-600 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">No se encontraron promociones.</h3>
            <p>Asegúrese de que las promociones en la tabla <code className="bg-gray-200 px-1 rounded">items</code> de Supabase tengan el campo <code className="bg-gray-200 px-1 rounded">is_combo</code> marcado como <code className="bg-gray-200 px-1 rounded">TRUE</code>.</p>
        </div>
      );
    }
    
    return (
      <motion.div 
        className="grid lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {promotions.map((promo) => (
          <motion.div
            key={promo.id}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 border-t-4 border-pink-400"
            variants={cardVariants}
          >
            <div className="bg-pink-100 p-4 rounded-full mb-4">
              <Sparkles className="text-pink-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{promo.title}</h3>
            
            <ul className="mb-6 space-y-2 text-left w-full flex-grow">
              {promo.includes.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto w-full">
              <p className="text-4xl font-bold text-pink-500 mb-6">${promo.price.toLocaleString('es-AR')}</p>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="w-full bg-pink-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-500 transition-transform duration-300 hover:scale-105"
              >
                ¡Lo quiero!
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <section id="promociones" className="py-20 bg-pink-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Promociones Exclusivas</h2>
          <p className="text-lg text-gray-500 mt-2">Combiná zonas y obtené los mejores precios.</p>
          <div className="mt-4 w-24 h-1 bg-pink-400 mx-auto rounded"></div>
        </div>
        {renderContent()}
      </div>
    </section>
  );
};

export default Promotions;
