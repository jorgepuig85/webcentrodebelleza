
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MapPin, ArrowRight } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionLink = motion(Link);

type Location = {
  id: number;
  name: string;
  province: string;
};

const headerContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.58, 1] as const }
  }
};

const LocationCardSkeleton = () => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-md flex items-center gap-4 animate-pulse">
    <div className="bg-gray-200 w-12 h-12 rounded-full flex-shrink-0"></div>
    <div className="w-full">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const LocationsPreview: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, province')
          .order('name', { ascending: true })
          .limit(6); // Fetch only 6 locations for the preview
        
        if (error) throw error;
        if (data) setLocations(data);

      } catch (err: any) {
        console.error("Error fetching locations preview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);
  
  return (
    <section id="ubicaciones" className="py-20 bg-theme-background">
      <div className="container mx-auto px-6">
        <MotionDiv
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerContainerVariants}
        >
          <MotionDiv variants={headerItemVariants}>
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Nuestras Localidades</AnimatedTitle>
          </MotionDiv>
          <MotionP variants={headerItemVariants} className="text-lg text-theme-text mt-2">Te acercamos la mejor tecnología estés donde estés.</MotionP>
          <MotionDiv variants={headerItemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></MotionDiv>
        </MotionDiv>

        <MotionDiv 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {loading 
            ? [...Array(6)].map((_, i) => <LocationCardSkeleton key={i} />)
            : locations.map((location) => (
                <MotionDiv
                  key={location.id}
                  className="bg-theme-background-soft p-6 rounded-lg shadow-md flex items-center gap-4"
                  variants={cardVariants}
                >
                  <div className="bg-theme-primary-soft text-theme-primary p-3 rounded-full flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-theme-text-strong">{location.name}</h3>
                    <p className="text-theme-text">{location.province}</p>
                  </div>
                </MotionDiv>
              ))}
        </MotionDiv>

        <MotionDiv 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
            <MotionLink
                to="/ubicaciones"
                className="inline-flex items-center gap-2 bg-theme-primary text-theme-text-inverted px-8 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover text-lg"
            >
                Ver Todas las Localidades
                <ArrowRight />
            </MotionLink>
        </MotionDiv>
      </div>
    </section>
  );
};

export default LocationsPreview;