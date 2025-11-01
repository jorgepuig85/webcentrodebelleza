import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, wrap } from 'framer-motion';
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
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
};

const ServiceCardSkeleton: React.FC = () => (
  <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="relative h-64 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

const ServicePreviewCard: React.FC<{ service: Service }> = ({ service }) => {
  const baseUrl = service.image.split('?')[0];
  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/servicios">
        <div className="relative h-64">
          <img 
            src={service.image} 
            alt={service.name} 
            className="w-full h-full object-cover" 
            loading="lazy"
            decoding="async"
            width="400"
            height="256"
            srcSet={`
              ${baseUrl}?format=webp&quality=75&width=400 400w,
              ${baseUrl}?format=webp&quality=75&width=600 600w,
              ${baseUrl}?format=webp&quality=75&width=800 800w
            `}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:from-black/50"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold drop-shadow-md">{service.name.replace(/^(Mujer - |Hombre - |Unisex - )/, '')}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ServicesPreview = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovering, setIsHovering] = useState(false);

  const serviceIndex = wrap(0, services.length, page);

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const topServiceNames = [
          'Mujer - Axilas',
          'Mujer - Rostro',
          'Mujer - Piernas Completas',
          'Mujer - Cavado Completo'
        ];

        const { data, error } = await supabase
          .from('items')
          .select('id, name, image_url')
          .in('name', topServiceNames);
        
        if (error) throw error;
        
        if (data) {
           const formattedServices: Service[] = data.map((item: FetchedItem) => ({
              id: item.id,
              name: item.name,
              image: item.image_url
                ? `${item.image_url}?format=webp&quality=75&width=400`
                : `https://picsum.photos/seed/${encodeURIComponent(item.name)}/400/300`,
            }));
            
            const orderedServices = topServiceNames.map(name => 
              formattedServices.find(service => service.name === name)
            ).filter((s): s is Service => s !== undefined);

          setServices(orderedServices);
        }
      } catch (err) {
        console.error("Error fetching services preview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay timer effect
  useEffect(() => {
    if (isDesktop || isHovering || loading || services.length <= 1) {
        return;
    }

    const interval = setInterval(() => {
      // Update state directly to avoid unstable dependencies
      setPage(prev => [prev[0] + 1, 1]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isDesktop, isHovering, loading, services.length]);

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
        
        {isDesktop ? (
          <MotionDiv 
            className="grid lg:grid-cols-4 gap-8"
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
        ) : (
          <div 
            className="relative h-72 w-full max-w-lg mx-auto mb-12"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {loading ? <ServiceCardSkeleton /> : (
              <AnimatePresence initial={false} custom={direction}>
                <MotionDiv
                  key={page}
                  className="absolute w-full h-full"
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const power = swipePower(offset.x, velocity.x);
                    if (power < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (power > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                >
                  <ServicePreviewCard service={services[serviceIndex]} />
                </MotionDiv>
              </AnimatePresence>
            )}
            
            {!loading && services.length > 1 && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {services.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage([i, i > page ? 1 : -1])}
                    className={`w-2 h-2 rounded-full transition-colors ${i === serviceIndex ? 'bg-theme-primary' : 'bg-theme-border'}`}
                    aria-label={`Ir al servicio ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

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