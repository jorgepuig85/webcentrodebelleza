
import React, { useState, useEffect } from 'react';
import { motion as fm } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { MapPin } from 'lucide-react';

type Location = {
  id: number;
  name: string;
  province: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1]
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

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await supabase
          .from('locations')
          .select('id, name, province')
          .order('name', { ascending: true });
        
        const { data, error: fetchError } = response;
        if (fetchError) throw fetchError;
        
        if (data) {
          setLocations(data);
        }

      } catch (err: any) {
        console.error("Error fetching locations:", err);
        setError('No se pudieron cargar las localidades. Por favor, intente más tarde.');
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
        <div className="text-center text-gray-600 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">No se encontraron localidades de atención.</h3>
          <p>Verifique que la tabla <code className="bg-gray-200 px-1 rounded">locations</code> de Supabase tenga datos.</p>
        </div>
      );
    }

    return (
      <fm.div 
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {locations.map((location) => (
          <fm.div
            key={location.id}
            className="bg-gray-50 p-6 rounded-lg shadow-md flex items-center gap-4 transform hover:-translate-y-1 transition-transform duration-300"
            variants={cardVariants}
          >
            <div className="bg-pink-100 text-pink-500 p-3 rounded-full flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{location.name}</h3>
              <p className="text-gray-600">{location.province}</p>
            </div>
          </fm.div>
        ))}
      </fm.div>
    );
  };

  return (
    <section id="ubicaciones" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Nuestras Localidades de Atención</h2>
          <p className="text-lg text-gray-600 mt-2">Te acercamos la mejor tecnología estés donde estés.</p>
          <div className="mt-4 w-24 h-1 bg-pink-400 mx-auto rounded"></div>
        </div>
        {renderContent()}
      </div>
    </section>
  );
};

export default Locations;