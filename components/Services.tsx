import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ChevronRight } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;
const MotionP = motion.p;

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};


const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1] as const
    }
  }
};

// FIX: Explicitly type as React.FC to handle 'key' prop correctly.
const ServiceCardSkeleton: React.FC = () => (
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

// FIX: Explicitly type as React.FC to handle 'key' prop correctly.
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const baseUrl = service.image.split('?')[0];
  return (
    <MotionDiv
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
          decoding="async"
          width="400"
          height="224"
          srcSet={`
            ${baseUrl}?format=webp&quality=75&width=400 400w,
            ${baseUrl}?format=webp&quality=75&width=600 600w,
            ${baseUrl}?format=webp&quality=75&width=800 800w
          `}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <AnimatedTitle as="h3" className="text-2xl font-bold">{service.name.replace(/^(Mujer - |Hombre - |Unisex - )/, '')}</AnimatedTitle>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-theme-text mb-4 flex-grow min-h-[4rem]">{service.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-theme-primary">${service.price.toLocaleString('es-AR')}</span>
          <Link to="/contacto" className="text-theme-primary font-semibold flex items-center gap-1 group-hover:underline">
            Consultar
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </MotionDiv>
  );
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'woman' | 'man'>('woman');

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
  
  const womanServices = services.filter(s => s.name.startsWith('Mujer - ') || s.name.startsWith('Unisex - '));
  const manServices = services.filter(s => s.name.startsWith('Hombre - ') || s.name.startsWith('Unisex - '));
  const servicesToDisplay = activeTab === 'woman' ? womanServices : manServices;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <ServiceCardSkeleton key={i} />)}
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
    }
    if (services.length === 0) {
      return (
        <div className="text-center text-theme-text bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">No se encontraron servicios.</h3>
          <p>Verifique que los servicios en la tabla <code className="bg-gray-200 px-1 rounded">items</code> de Supabase tengan el campo <code className="bg-gray-200 px-1 rounded">is_combo</code> como <code className="bg-gray-200 px-1 rounded">false</code>.</p>
        </div>
      );
    }
    if (servicesToDisplay.length === 0) {
      return (
        <div className="text-center text-theme-text bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">No se encontraron servicios para esta categoría.</h3>
          <p>Pronto agregaremos nuevos servicios aquí.</p>
        </div>
      );
    }
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesToDisplay.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    );
  };

  return (
    <section className="pt-32 pb-20 animated-gradient-background-soft">
      <div className="container mx-auto px-6">
        <MotionDiv
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <MotionDiv variants={itemVariants}>
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Nuestros Servicios</AnimatedTitle>
          </MotionDiv>
          <MotionP variants={itemVariants} className="text-lg text-theme-text mt-2">Elegí la zona que querés tratar y empezá tu cambio.</MotionP>
          <MotionDiv variants={itemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></MotionDiv>
        </MotionDiv>
        
        <div className="flex justify-center mb-8">
          <div className="bg-theme-background p-1 rounded-full flex gap-1 shadow-sm">
            <button
              onClick={() => setActiveTab('woman')}
              className={`px-8 py-2 rounded-full font-semibold transition-colors duration-300 text-sm md:text-base ${activeTab === 'woman' ? 'bg-theme-primary text-theme-text-inverted shadow' : 'text-theme-text hover:bg-theme-primary-soft'}`}
              aria-pressed={activeTab === 'woman'}
            >
              Mujer
            </button>
            <button
              onClick={() => setActiveTab('man')}
              className={`px-8 py-2 rounded-full font-semibold transition-colors duration-300 text-sm md:text-base ${activeTab === 'man' ? 'bg-theme-primary text-theme-text-inverted shadow' : 'text-theme-text hover:bg-theme-primary-soft'}`}
              aria-pressed={activeTab === 'man'}
            >
              Hombre
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
    </section>
  );
};

export default Services;
