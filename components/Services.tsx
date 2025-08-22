import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { ChevronRight } from 'lucide-react';

// Updated type to match the component's needs, will be populated from DB data
type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

type FetchedItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1]
    }
  }
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h2>
    <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
    <div className="mt-4 w-24 h-1 bg-pink-400 mx-auto rounded"></div>
  </div>
);

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col animate-pulse">
    <div className="relative h-56 bg-gray-200"></div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="flex justify-between items-center mt-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 flex flex-col"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="relative h-56">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover" 
          loading="lazy"
          width="400"
          height="224"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">{service.name}</h3>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-gray-600 mb-4 flex-grow min-h-[4rem]">{service.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-pink-500">${service.price.toLocaleString('es-AR')}</span>
          <button onClick={() => scrollToSection('contacto')} className="text-pink-500 font-semibold flex items-center gap-1 group-hover:underline">
            Consultar
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('items')
          .select('id, name, description, price, image_url')
          .eq('is_combo', false)
          .order('name', { ascending: true });
        
        if (fetchError) throw fetchError;
        
        if (data) {
           const formattedServices: Service[] = data.map((item: FetchedItem) => {
            const imageUrl = item.image_url
              ? `${item.image_url}?format=webp&quality=75&width=400`
              : `https://picsum.photos/seed/${encodeURIComponent(item.name)}/400/300`;
            
            return {
              id: item.id,
              name: item.name,
              description: item.description || 'Consulta por más detalles de este servicio.',
              price: item.price,
              image: imageUrl,
            };
          });
          setServices(formattedServices);
        }

      } catch (err) {
        console.error("Error fetching services:", err);
        setError('No se pudieron cargar los servicios. Por favor, intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <ServiceCardSkeleton key={i} />)}
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
    }
    if (services.length === 0) {
      return (
        <div className="text-center text-gray-600 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">No se encontraron servicios.</h3>
          <p>Verifique que los servicios en la tabla <code className="bg-gray-200 px-1 rounded">items</code> de Supabase tengan el campo <code className="bg-gray-200 px-1 rounded">is_combo</code> como <code className="bg-gray-200 px-1 rounded">false</code>.</p>
        </div>
      );
    }
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    );
  };

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionHeader title="Nuestros Servicios" subtitle="Elegí la zona que querés tratar y empezá tu cambio." />
        {renderContent()}
      </div>
    </section>
  );
};

export default Services;