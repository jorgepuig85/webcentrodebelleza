
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;
const MotionP = motion.p;

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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1] as const
    }
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

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString();

        const [locationsRes, rentalsRes] = await Promise.all([
          supabase
            .from('locations')
            .select('id, name, province')
            .order('name', { ascending: true }),
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
        console.error("Error fetching locations and rentals:", err);
        setError('No se pudieron cargar los datos. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <LocationCardSkeleton key={i} />)}
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
    }

    if (locations.length === 0) {
      return (
        <div className="text-center text-theme-text bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">No se encontraron localidades de atención.</h3>
          <p>Verifique que la tabla <code className="bg-gray-200 px-1 rounded">locations</code> de Supabase tenga datos.</p>
        </div>
      );
    }

    return (
      <MotionDiv 
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {locations.map((location) => {
          const locationRentals = rentals.filter(r => r.location_id === location.id);
          return (
            <MotionDiv
              key={location.id}
              className="bg-theme-background p-6 rounded-lg shadow-md flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300"
              variants={cardVariants}
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="bg-theme-primary-soft text-theme-primary p-3 rounded-full flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <AnimatedTitle as="h3" className="text-lg font-semibold text-theme-text-strong">{location.name}</AnimatedTitle>
                    <p className="text-theme-text">{location.province}</p>
                  </div>
                </div>
              </div>

              {locationRentals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-theme-border/20">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-theme-primary mb-2">
                    <Calendar size={16} />
                    Próximas Visitas
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {locationRentals.slice(0, 2).map(rental => (
                        <li key={`${rental.start_date}-${rental.end_date}`} className="text-sm text-theme-text-strong font-medium">
                            {formatRentalDate(rental)}
                        </li>
                    ))}
                  </ul>
                  <Link 
                    to="/contacto"
                    className="mt-4 inline-flex items-center gap-2 text-center bg-theme-primary text-theme-text-inverted px-4 py-2 rounded-full font-semibold text-sm hover:bg-theme-primary-hover seasonal-glow-hover"
                  >
                    Reservar Turno
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </MotionDiv>
          )
        })}
      </MotionDiv>
    );
  };

  return (
    <section className="pt-32 pb-20 bg-theme-background">
      <div className="container mx-auto px-6">
        <MotionDiv
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerContainerVariants}
        >
          <MotionDiv variants={headerItemVariants}>
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Nuestras Localidades de Atención</AnimatedTitle>
          </MotionDiv>
          <MotionP variants={headerItemVariants} className="text-lg text-theme-text mt-2">Te acercamos la mejor tecnología estés donde estés.</MotionP>
          <MotionDiv variants={headerItemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></MotionDiv>
        </MotionDiv>
        {renderContent()}
      </div>
    </section>
  );
};

export default Locations;
