




import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TESTIMONIALS } from '../constants';
import { ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionLink = motion(Link);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const TestimonialsPreview: React.FC = () => {
  const [index, setIndex] = useState(0);

  const nextTestimonial = () => {
    setIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    nextTestimonial();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevTestimonial();
  };
  
  const currentTestimonial = TESTIMONIALS[index];

  return (
    <section id="testimonios" className="py-20 animated-gradient-background-soft">
      <div className="container mx-auto px-6">
        <MotionDiv
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <MotionDiv variants={itemVariants}>
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Opiniones que nos inspiran</AnimatedTitle>
          </MotionDiv>
          <MotionP variants={itemVariants} className="text-lg text-theme-text mt-2">La satisfacción de nuestras clientas es nuestra mejor publicidad.</MotionP>
          <MotionDiv variants={itemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></MotionDiv>
        </MotionDiv>
        
        <MotionDiv
          className="relative max-w-3xl mx-auto h-80 md:h-64 flex items-center justify-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <MotionDiv
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <div className="bg-theme-background p-8 rounded-lg shadow-lg text-center">
                <Quote className="text-theme-primary/50 w-12 h-12 mx-auto mb-4" />
                <p className="text-theme-text italic mb-6">"{currentTestimonial.quote}"</p>
                <div className="flex items-center justify-center gap-4">
                    <img 
                      src={currentTestimonial.image} 
                      alt={currentTestimonial.name} 
                      className="w-14 h-14 rounded-full object-cover" 
                      loading="lazy"
                      decoding="async"
                      width="56"
                      height="56"
                    />
                    <div>
                        <p className="font-bold text-lg text-theme-text-strong">{currentTestimonial.name}</p>
                        <p className="text-theme-primary">{currentTestimonial.service}</p>
                    </div>
                </div>
              </div>
            </MotionDiv>
          </AnimatePresence>
          
          <button onClick={handlePrev} aria-label="Testimonio anterior" className="absolute left-0 -translate-x-12 top-1/2 -translate-y-1/2 bg-theme-background p-3 rounded-full shadow-md hover:bg-theme-primary-soft transition-colors">
            <ChevronLeft className="text-theme-primary" />
          </button>
          <button onClick={handleNext} aria-label="Siguiente testimonio" className="absolute right-0 translate-x-12 top-1/2 -translate-y-1/2 bg-theme-background p-3 rounded-full shadow-md hover:bg-theme-primary-soft transition-colors">
            <ChevronRight className="text-theme-primary" />
          </button>
        </MotionDiv>
         <MotionDiv 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
            <MotionLink
                to="/testimonios"
                className="inline-flex items-center gap-2 bg-theme-primary text-theme-text-inverted px-8 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover text-lg"
            >
                Ver todos los testimonios
                <ArrowRight />
            </MotionLink>
        </MotionDiv>
      </div>
    </section>
  );
};

export default TestimonialsPreview;