import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { BackgroundGradient } from './ui/BackgroundGradient';
import AnimatedTitle from './ui/AnimatedTitle';

const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionLink = motion(Link);

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

const TechnologyPreview: React.FC = () => {
  const features = [
    { icon: Zap, title: "Máxima Eficacia", description: "Resultados visibles desde la primera sesión." },
    { icon: ShieldCheck, title: "Seguridad Garantizada", description: "Equipos certificados operados por profesionales." },
  ];
  const baseUrl = "https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/equipo_depilacion.jpg";

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
                src={`${baseUrl}?format=webp&quality=75&width=600`}
                alt="Equipo de depilación láser de última generación"
                className="rounded-2xl w-full h-auto aspect-[4/3] object-cover bg-gray-200"
                loading="lazy"
                decoding="async"
                width="600"
                height="450"
                srcSet={`
                  ${baseUrl}?format=webp&quality=75&width=400 400w,
                  ${baseUrl}?format=webp&quality=75&width=800 800w,
                  ${baseUrl}?format=webp&quality=75&width=1200 1200w
                `}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </BackgroundGradient>
          </MotionDiv>
          <MotionDiv variants={textContainerVariants}>
            <MotionDiv variants={textItemVariants}>
              <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong mb-4">Tecnología de Vanguardia</AnimatedTitle>
            </MotionDiv>
            <MotionP variants={textItemVariants} className="text-lg text-theme-text mb-8">
              Utilizamos la última tecnología en depilación láser para ofrecerte un tratamiento seguro, rápido y prácticamente indoloro.
            </MotionP>
            <MotionDiv variants={textContainerVariants} className="space-y-6 mb-8">
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
             <MotionLink
                to="/tecnologia"
                variants={textItemVariants}
                className="inline-flex items-center gap-2 bg-theme-primary text-theme-text-inverted px-8 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover"
            >
                Conocé nuestra tecnología
                <ArrowRight />
            </MotionLink>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
};

export default TechnologyPreview;
