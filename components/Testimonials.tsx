import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../constants';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
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
  
  return (
    <section id="testimonios" className="py-20 bg-theme-background-soft">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-theme-text-strong">Lo que dicen nuestras clientas</h2>
          <p className="text-lg text-theme-text mt-2">La satisfacción de nuestras clientas es nuestra mejor publicidad.</p>
          <div className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></div>
        </div>
        
        <div className="relative max-w-3xl mx-auto h-80 md:h-64 flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
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
                <p className="text-theme-text italic mb-6">"{TESTIMONIALS[index].quote}"</p>
                <div className="flex items-center justify-center gap-4">
                    <img 
                      src={TESTIMONIALS[index].image} 
                      alt={TESTIMONIALS[index].name} 
                      className="w-14 h-14 rounded-full object-cover" 
                      loading="lazy"
                      width="56"
                      height="56"
                    />
                    <div>
                        <p className="font-bold text-lg text-theme-text-strong">{TESTIMONIALS[index].name}</p>
                        <p className="text-theme-primary">{TESTIMONIALS[index].service}</p>
                    </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <button onClick={handlePrev} aria-label="Testimonio anterior" className="absolute left-0 -translate-x-12 top-1/2 -translate-y-1/2 bg-theme-background p-3 rounded-full shadow-md hover:bg-theme-primary-soft transition-colors">
            <ChevronLeft className="text-theme-primary" />
          </button>
          <button onClick={handleNext} aria-label="Siguiente testimonio" className="absolute right-0 translate-x-12 top-1/2 -translate-y-1/2 bg-theme-background p-3 rounded-full shadow-md hover:bg-theme-primary-soft transition-colors">
            <ChevronRight className="text-theme-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;