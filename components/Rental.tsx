

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, TrendingUp, LifeBuoy, CalendarDays } from 'lucide-react';
import { BackgroundGradient } from './ui/BackgroundGradient';
import AnimatedTitle from './ui/AnimatedTitle';
import RentalSchedule from './RentalSchedule';

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
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const textItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};


const Rental: React.FC = () => {
    const benefits = [
        { icon: Zap, title: "Tecnología de Punta", description: "Ofrecé a tus clientes los mejores resultados con un equipo de última generación." },
        { icon: TrendingUp, title: "Rentabilidad Asegurada", description: "Ampliá tus servicios y aumentá tus ingresos sin una gran inversión inicial." },
        { icon: LifeBuoy, title: "Soporte y Capacitación", description: "Te brindamos la formación necesaria para que operes el equipo con total seguridad." },
        { icon: CalendarDays, title: "Flexibilidad de Fechas", description: "Consultá por nuestras jornadas de alquiler y encontrá la que mejor se adapte a tu agenda." },
    ];

    return (
        <section id="alquiler" className="pt-32 pb-20 animated-gradient-primary-soft">
            <div className="container mx-auto px-6">
                <MotionDiv
                    className="grid lg:grid-cols-2 gap-12 items-center"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <MotionDiv variants={textContainerVariants}>
                        <MotionDiv variants={textItemVariants}>
                          <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong mb-4">Alquiler para Profesionales</AnimatedTitle>
                        </MotionDiv>
                        <MotionP variants={textItemVariants} className="text-lg text-theme-text mb-8">
                            ¿Sos profesional de la estética? Potenciá tu negocio y ofrecé a tus clientes el tratamiento de depilación definitiva más avanzado. Te ofrecemos nuestro equipo por jornadas completas.
                        </MotionP>
                        <MotionDiv variants={textContainerVariants} className="space-y-6 mb-8">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                <MotionDiv key={index} className="flex items-start gap-4" variants={textItemVariants}>
                                    <div className="bg-theme-primary-soft/80 text-theme-primary p-3 rounded-full">
                                    <Icon size={24} />
                                    </div>
                                    <div>
                                    <AnimatedTitle as="h3" className="text-xl font-semibold text-theme-text-strong">{benefit.title}</AnimatedTitle>
                                    <p className="text-theme-text">{benefit.description}</p>
                                    </div>
                                </MotionDiv>
                                );
                            })}
                        </MotionDiv>
                        <MotionLink 
                            variants={textItemVariants}
                            to="/contacto"
                            className="w-full sm:w-auto bg-theme-primary text-theme-text-inverted px-8 py-3 rounded-full font-semibold hover:bg-theme-primary-hover seasonal-glow-hover animate-heartbeat"
                        >
                            Consultar Disponibilidad
                        </MotionLink>
                    </MotionDiv>
                     <MotionDiv variants={imageVariants}>
                        <BackgroundGradient containerClassName="rounded-2xl">
                            <img 
                                src="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/rental.png?format=webp&quality=75&width=600" 
                                alt="Gráfico de alquiler de equipo de depilación láser para profesionales"
                                className="rounded-2xl w-full h-auto aspect-[4/3] object-cover bg-gray-200"
                                loading="lazy"
                                width="600"
                                height="450"
                            />
                        </BackgroundGradient>
                    </MotionDiv>
                </MotionDiv>
                
                {/* New Rental Schedule Section */}
                <RentalSchedule />

            </div>
        </section>
    );
};

export default Rental;