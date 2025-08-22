
import React from 'react';
import { motion as fm } from 'framer-motion';
import { Zap, TrendingUp, LifeBuoy, CalendarDays } from 'lucide-react';
import { BackgroundGradient } from './ui/BackgroundGradient';

const Rental: React.FC = () => {
    const benefits = [
        { icon: Zap, title: "Tecnología de Punta", description: "Ofrecé a tus clientes los mejores resultados con un equipo de última generación." },
        { icon: TrendingUp, title: "Rentabilidad Asegurada", description: "Ampliá tus servicios y aumentá tus ingresos sin una gran inversión inicial." },
        { icon: LifeBuoy, title: "Soporte y Capacitación", description: "Te brindamos la formación necesaria para que operes el equipo con total seguridad." },
        { icon: CalendarDays, title: "Flexibilidad de Fechas", description: "Consultá por nuestras jornadas de alquiler y encontrá la que mejor se adapte a tu agenda." },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="alquiler" className="py-20 bg-pink-50">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <fm.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Alquiler para Profesionales</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            ¿Sos profesional de la estética? Potenciá tu negocio y ofrecé a tus clientes el tratamiento de depilación definitiva más avanzado. Te ofrecemos nuestro equipo por jornadas completas.
                        </p>
                        <div className="space-y-6 mb-8">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="bg-pink-100 text-pink-500 p-3 rounded-full">
                                    <Icon size={24} />
                                    </div>
                                    <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{benefit.title}</h3>
                                    <p className="text-gray-600">{benefit.description}</p>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                        <button 
                            onClick={() => scrollToSection('contacto')}
                            className="w-full sm:w-auto bg-pink-400 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-500 transition-transform duration-300 hover:scale-105"
                        >
                            Consultar Disponibilidad
                        </button>
                    </fm.div>
                     <fm.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
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
                    </fm.div>
                </div>
            </div>
        </section>
    );
};

export default Rental;