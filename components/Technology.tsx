

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Heart, Leaf } from 'lucide-react';
import { BackgroundGradient } from './ui/BackgroundGradient';
import AnimatedTitle from './ui/AnimatedTitle';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;
const MotionP = motion.p;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 }
  }
};

const textItemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const featureItemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
}

const Technology: React.FC = () => {
  const features = [
    { icon: Zap, title: "Máxima Eficacia", description: "Elimina el vello de forma rápida y efectiva, con resultados visibles desde la primera sesión." },
    { icon: ShieldCheck, title: "Seguridad Garantizada", description: "Nuestros equipos cuentan con certificaciones internacionales y son operados por profesionales." },
    { icon: Heart, title: "Tratamiento Indoloro", description: "Sistema de refrigeración avanzado que protege tu piel y asegura una experiencia confortable." },
    { icon: Leaf, title: "Apto para tu Piel", description: "Tecnología versátil que se adapta a diferentes tipos de piel y vello, todo el año." },
  ];

  return (
    <section id="tecnologia" className="py-20 bg-theme-background">
      <div className="container mx-auto px-6">
        <MotionDiv
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <MotionDiv variants={itemVariants}>
            <BackgroundGradient containerClassName="rounded-2xl">
              <img 
                src="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/equipo_depilacion.jpg?format=webp&quality=75&width=600" 
                alt="Equipo de depilación láser de última generación"
                className="rounded-2xl w-full h-auto aspect-[4/3] object-cover bg-gray-200"
                loading="lazy"
                width="600"
                height="450"
              />
            </BackgroundGradient>
          </MotionDiv>
          <MotionDiv variants={textContainerVariants}>
            <MotionDiv variants={textItemVariants}>
              <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong mb-4">Tecnología de Vanguardia</AnimatedTitle>
            </MotionDiv>
            <MotionP variants={textItemVariants} className="text-lg text-theme-text mb-8">
              Utilizamos la última tecnología en depilación láser de diodo para ofrecerte un tratamiento seguro, rápido y prácticamente indoloro. Nuestra prioridad es tu comodidad y los mejores resultados.
            </MotionP>
            <MotionDiv variants={textContainerVariants} className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <MotionDiv key={index} className="flex items-start gap-4" variants={featureItemVariants}>
                    <div className="bg-theme-primary-soft text-theme-primary p-3 rounded-full">
                      <Icon size={24} />
                    </div>
                    <div>
                      <AnimatedTitle as="h3" className="text-xl font-semibold text-theme-text-strong">{feature.title}</AnimatedTitle>
                      <p className="text-theme-text">{feature.description}</p>
                    </div>
                  </MotionDiv>
                );
              })}
            </MotionDiv>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
};

export default Technology;