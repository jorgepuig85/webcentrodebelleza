



import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

const MotionDiv = motion.div;
const MotionP = motion.p;

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

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

const TestimonialCard: React.FC<{ testimonial: typeof TESTIMONIALS[0] }> = ({ testimonial }) => {
  return (
    <MotionDiv
      className="bg-theme-background p-8 rounded-lg shadow-lg text-center h-full flex flex-col"
      variants={cardVariants}
    >
      <Quote className="text-theme-primary/50 w-12 h-12 mx-auto mb-4" />
      <p className="text-theme-text italic mb-6 flex-grow">"{testimonial.quote}"</p>
      <div className="flex items-center justify-center gap-4 mt-auto">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover"
          loading="lazy"
          decoding="async"
          width="56"
          height="56"
        />
        <div>
          <p className="font-bold text-lg text-theme-text-strong">{testimonial.name}</p>
          <p className="text-theme-primary">{testimonial.service}</p>
        </div>
      </div>
    </MotionDiv>
  );
};


const Testimonials: React.FC = () => {
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
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Lo que dicen nuestras clientas</AnimatedTitle>
          </MotionDiv>
          <MotionP variants={itemVariants} className="text-lg text-theme-text mt-2">La satisfacción de nuestras clientas es nuestra mejor publicidad.</MotionP>
          <MotionDiv variants={itemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></MotionDiv>
        </MotionDiv>
        
        <MotionDiv
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </MotionDiv>
      </div>
    </section>
  );
};

export default Testimonials;