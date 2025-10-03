
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionLink = motion(Link);

type Location = {
  id: number;
  name: string;
  province: string;
};

type Rental = {
  location_id: number;
  start_date: string;
  end_date: string;
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

const formatRentalDate = (rental: Rental): string => {
    const start = new Date(rental.start_date + 'T00:00:00Z');
    const end = new Date(rental.end_date + 'T00:00:00Z');

    const dayOptions: Intl.DateTimeFormatOptions = { day: 'numeric', timeZone: 'UTC' };
    const fullOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', timeZone: 'UTC' };

    const startDay = new Intl.DateTimeFormat('es-AR', dayOptions).format(start);
    const endFull = new Intl.DateTimeFormat('es-AR', fullOptions).format(end);

    if (start.getTime() === end.getTime()) {
        return new Intl.DateTimeFormat('es-AR', fullOptions).format(start);
    }
    
    const nextDay = new Date(start);
    nextDay.setUTCDate(start.getUTCDate() + 1);
    if (nextDay.getTime() === end.getTime()) {
        return `${startDay} y ${endFull}`;
    }

    return `Del ${startDay} al ${endFull}`;
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
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString();

        const [locationsRes, rentalsRes] = await Promise.all([
           supabase
            .from('locations')
            .select('id, name, province')
            .order('name', { ascending: true })
            .limit(6),
           supabase
            .from('rentals')
            .select('location_id, start_date, end_date')
            .gte('start_date', today)
            .order('start_date', { ascending: true })
        ]);
        
        if (locationsRes.error) throw locationsRes.error;
        if (rentalsRes.error) throw rentalsRes.error;

        if (locationsRes.data) setLocations(locationsRes.data);
        if (rentalsRes.data) setRentals(rentalsRes.data as Rental[]);

      } catch (err: any) {
        console.error("Error fetching locations/rentals preview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            : locations.map((location) => {
                const nextRental = rentals.find(r => r.location_id === location.id);
                return (
                  <MotionDiv
                    key={location.id}
                    className="bg-theme-background-soft p-6 rounded-lg shadow-md flex flex-col justify-between"
                    variants={cardVariants}
                  >
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="bg-theme-primary-soft text-theme-primary p-3 rounded-full flex-shrink-0">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-theme-text-strong">{location.name}</h3>
                          <p className="text-theme-text">{location.province}</p>
                        </div>
                      </div>
                    </div>
                    {nextRental && (
                      <div className="mt-4 pt-4 border-t border-theme-border/20 text-sm">
                          <p className="font-bold text-theme-primary flex items-center gap-1.5"><Calendar size={14}/>Próxima visita:</p>
                          <p className="text-theme-text-strong font-medium pl-5">{formatRentalDate(nextRental)}</p>
                      </div>
                    )}
                  </MotionDiv>
                )
            })}
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
