import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionLink = motion(Link);

type Service = {
  id: string;
  name: string;
  image: string;
};

type FetchedItem = {
  id: string;
  name: string;
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1] as const
    }
  }
};

const ServiceCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="relative h-64 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

const ServicePreviewCard: React.FC<{ service: Service }> = ({ service }) => {
  return (
    <MotionDiv
      className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300"
      variants={cardVariants}
    >
      <Link to="/servicios">
        <div className="relative h-64">
          <img 
            src={service.image} 
            alt={service.name} 
            className="w-full h-full object-cover" 
            loading="lazy"
            width="400"
            height="256"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:from-black/50"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold drop-shadow-md">{service.name.replace(/^(Mujer - |Hombre - |Unisex - )/, '')}</h3>
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
};

const ServicesPreview = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('items')
          .select('id, name, image_url')
          .eq('is_combo', false)
          .order('name', { ascending: true })
          .limit(4); // Fetch only 4 services for the preview
        
        if (error) throw error;
        
        if (data) {
           const formattedServices: Service[] = data.map((item: FetchedItem) => ({
              id: item.id,
              name: item.name,
              image: item.image_url
                ? `${item.image_url}?format=webp&quality=75&width=400`
                : `https://picsum.photos/seed/${encodeURIComponent(item.name)}/400/300`,
            }));
          setServices(formattedServices);
        }

      } catch (err) {
        console.error("Error fetching services preview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  
  return (
    <section id="servicios" className="py-20 animated-gradient-background-soft">
      <div className="container mx-auto px-6">
        <MotionDiv
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <MotionDiv variants={itemVariants}>
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Nuestros Servicios Destacados</AnimatedTitle>
          </MotionDiv>
          <MotionP variants={itemVariants} className="text-lg text-theme-text mt-2">Descubrí algunos de nuestros tratamientos más populares.</MotionP>
          <MotionDiv variants={itemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></MotionDiv>
        </MotionDiv>
        
        <MotionDiv 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.15 }}
        >
          {loading 
            ? [...Array(4)].map((_, i) => <ServiceCardSkeleton key={i} />)
            : services.map((service) => <ServicePreviewCard key={service.id} service={service} />)
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
                to="/servicios"
                className="inline-flex items-center gap-2 bg-theme-primary text-theme-text-inverted px-8 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover text-lg"
            >
                Ver Todos los Servicios
                <ArrowRight />
            </MotionLink>
        </MotionDiv>
      </div>
    </section>
  );
};

export default ServicesPreview;