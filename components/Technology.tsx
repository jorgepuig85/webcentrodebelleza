
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Heart, Leaf } from 'lucide-react';

const Technology: React.FC = () => {
  const features = [
    { icon: Zap, title: "Máxima Eficacia", description: "Elimina el vello de forma rápida y efectiva, con resultados visibles desde la primera sesión." },
    { icon: ShieldCheck, title: "Seguridad Garantizada", description: "Nuestros equipos cuentan con certificaciones internacionales y son operados por profesionales." },
    { icon: Heart, title: "Tratamiento Indoloro", description: "Sistema de refrigeración avanzado que protege tu piel y asegura una experiencia confortable." },
    { icon: Leaf, title: "Apto para tu Piel", description: "Tecnología versátil que se adapta a diferentes tipos de piel y vello, todo el año." },
  ];

  return (
    <section id="tecnologia" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/sign/web/diodo-portatil-adss-1-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWFlYWVlNC0zNDhlLTQ1ZGUtYmYwMi1kODQwYzI3NjM0NzkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWIvZGlvZG8tcG9ydGF0aWwtYWRzcy0xLTEuanBnIiwiaWF0IjoxNzUzMTEzMTM3LCJleHAiOjE3ODQ2NDkxMzd9.PznQ-HCMOBiw_LtmcmVMjSbhqNYQplsLpzPUaDv-6Ec" 
              alt="Equipo de depilación láser de última generación"
              className="rounded-lg shadow-2xl w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tecnología de Vanguardia</h2>
            <p className="text-lg text-gray-500 mb-8">
              Utilizamos la última tecnología en depilación láser de diodo para ofrecerte un tratamiento seguro, rápido y prácticamente indoloro. Nuestra prioridad es tu comodidad y los mejores resultados.
            </p>
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-pink-100 text-pink-500 p-3 rounded-full">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Technology;