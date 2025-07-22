import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, Phone, MapPin, Instagram } from 'lucide-react';

type Inputs = {
  name: string;
  whatsapp: string;
  message: string;
  date: string;
  time: string;
};

const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => {
    const subject = encodeURIComponent(`Consulta desde la web de ${data.name}`);
    const body = encodeURIComponent(
      `Nombre: ${data.name}\n` +
      `WhatsApp: ${data.whatsapp}\n` +
      `Fecha preferida: ${data.date || 'No especificada'}\n` +
      `Hora preferida: ${data.time || 'No especificada'}\n\n` +
      `Mensaje:\n${data.message}`
    );
    window.location.href = `mailto:yani.2185@gmail.com?subject=${subject}&body=${body}`;
    alert('Serás redirigido/a a tu cliente de correo para enviar el mensaje. ¡Gracias!');
    reset();
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Contactanos y Reservá tu Turno</h2>
          <p className="text-lg text-gray-500 mt-2">Estamos para resolver todas tus dudas.</p>
          <div className="mt-4 w-24 h-1 bg-pink-400 mx-auto rounded"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            className="bg-gray-50 p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Solicitar Turno o Consulta</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input type="text" id="name" {...register("name", { required: "El nombre es requerido" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">Número de WhatsApp</label>
                <input type="tel" id="whatsapp" {...register("whatsapp", { required: "El WhatsApp es requerido" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                {errors.whatsapp && <span className="text-red-500 text-sm">{errors.whatsapp.message}</span>}
              </div>
               <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha preferida (Opcional)</label>
                <input type="date" id="date" {...register("date")} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
              </div>
               <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Hora preferida (Opcional)</label>
                <input type="time" id="time" {...register("time")} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea id="message" rows={4} {...register("message", { required: "Dejanos tu consulta" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></textarea>
                {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-pink-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-500 transition-transform duration-300 hover:scale-105">
                <Send size={20} /> Enviar Mensaje
              </button>
            </form>
          </motion.div>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Información de Contacto</h3>
              <div className="space-y-3">
                 <a href="https://wa.me/5492954391448?text=Hola!%20Quisiera%20hacer%20una%20consulta." target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 hover:text-pink-500">
                  <Phone className="w-6 h-6 text-pink-400" />
                  <span>+54 9 2954 39-1448</span>
                </a>
                <div className="flex items-start gap-4 text-gray-600">
                  <MapPin className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
                  <span>Neuquen 560, Miguel Riglos, La Pampa</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Seguinos en Redes</h3>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/centro_de_bellezays?igsh=N3IxanJicmJuOXc5" target="_blank" rel="noopener noreferrer" className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-pink-100 hover:text-pink-500 transition-colors"><Instagram /></a>
              </div>
            </div>
            <div>
              <iframe
                src="https://maps.google.com/maps?q=-36.85295661306252,-63.68863452311219&hl=es&z=15&output=embed"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-md"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;