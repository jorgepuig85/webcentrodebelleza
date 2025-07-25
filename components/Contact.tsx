import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, Phone, MapPin, Instagram, Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

type Inputs = {
  contactType: 'inquiry' | 'appointment';
  name: string;
  whatsapp: string;
  message: string;
  date?: string;
  time?: string;
};

const MotionDiv = motion.div;

const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<Inputs>({
    defaultValues: {
      contactType: 'inquiry',
    },
  });

  const contactType = watch('contactType');
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<'idle' | 'available' | 'unavailable' | 'error'>('idle');

  // Assumption: standard appointment duration is 30 minutes for the check.
  const APPOINTMENT_DURATION_MINUTES = 30;

  const checkAvailability = useCallback(async () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor, seleccioná una fecha y hora para verificar.');
      return;
    }

    setIsChecking(true);
    setAvailability('idle');

    try {
      // 1. Check for rentals/blockages for the entire day
      const { data: rentalData, error: rentalError } = await supabase
        .from('rentals')
        .select('id')
        .lte('start_date', selectedDate)
        .gte('end_date', selectedDate);
      
      if (rentalError) throw new Error(rentalError.message);
      if (rentalData && rentalData.length > 0) {
        setAvailability('unavailable');
        setIsChecking(false);
        return;
      }
      
      // 2. Check for overlapping appointments
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(startTime.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);
      
      const formatTime = (date: Date) => date.toTimeString().split(' ')[0];
      const startTimeStr = formatTime(startTime);
      const endTimeStr = formatTime(endTime);

      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('id')
        .eq('date', selectedDate)
        .lt('start_time', endTimeStr) // Existing appointment starts before new one ends
        .gt('end_time', startTimeStr); // Existing appointment ends after new one starts

      if (appointmentError) throw new Error(appointmentError.message);

      if (appointmentData && appointmentData.length > 0) {
        setAvailability('unavailable');
      } else {
        setAvailability('available');
      }

    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailability('error');
    } finally {
      setIsChecking(false);
    }
  }, [selectedDate, selectedTime]);

  const onSubmit: SubmitHandler<Inputs> = data => {
    const subject = encodeURIComponent(
      data.contactType === 'appointment' 
      ? `Solicitud de Turno de ${data.name}`
      : `Consulta desde la web de ${data.name}`
    );
    
    let bodyContent = `Nombre: ${data.name}\n` +
                      `WhatsApp: ${data.whatsapp}\n\n`;

    if (data.contactType === 'appointment') {
      bodyContent += `Fecha preferida: ${data.date || 'No especificada'}\n` +
                     `Hora preferida: ${data.time || 'No especificada'}\n\n`;
    }
    
    bodyContent += `Mensaje:\n${data.message}`;

    const body = encodeURIComponent(bodyContent);
    
    window.location.href = `mailto:yani.2185@gmail.com?subject=${subject}&body=${body}`;
    alert('Serás redirigido/a a tu cliente de correo para enviar el mensaje. La disponibilidad del turno será confirmada a la brevedad. ¡Gracias!');
    reset();
    setAvailability('idle');
  };

  const renderAvailabilityMessage = () => {
    if (availability === 'available') {
      return (
        <div className="mt-2 flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-md text-sm">
          <CheckCircle size={18} />
          <span>¡Horario disponible! Podés continuar y enviar tu solicitud.</span>
        </div>
      );
    }
    if (availability === 'unavailable') {
      return (
        <div className="mt-2 flex items-center gap-2 text-orange-600 bg-orange-50 p-2 rounded-md text-sm">
          <AlertCircle size={18} />
          <span>El horario no está disponible. Por favor, intentá con otro.</span>
        </div>
      );
    }
    if (availability === 'error') {
       return (
        <div className="mt-2 flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-md text-sm">
          <AlertCircle size={18} />
          <span>Error al verificar. Por favor, intentá más tarde o contactanos directamente.</span>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Contactanos</h2>
          <p className="text-lg text-gray-500 mt-2">Estamos para resolver todas tus dudas.</p>
          <div className="mt-4 w-24 h-1 bg-pink-400 mx-auto rounded"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <MotionDiv
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Envianos tu Mensaje</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contacto</label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      value="inquiry" 
                      {...register("contactType")}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300"
                    />
                    Hacer una Consulta
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      value="appointment" 
                      {...register("contactType")}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300"
                    />
                    Solicitar Turno
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input type="text" id="name" {...register("name", { required: "El nombre es requerido" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">Número de WhatsApp</label>
                <input type="tel" id="whatsapp" {...register("whatsapp", { required: "El WhatsApp es requerido" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                {errors.whatsapp && <span className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</span>}
              </div>

              {contactType === 'appointment' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <p className="text-sm text-gray-600 bg-pink-50 p-3 rounded-md border border-pink-100">
                    Por favor, seleccioná una fecha y hora, y <b>verificá la disponibilidad</b> antes de enviar tu solicitud.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha preferida</label>
                      <input type="date" id="date" {...register("date", { required: "La fecha es requerida para un turno"})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                      {errors.date && <span className="text-red-500 text-sm mt-1">{errors.date.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">Hora preferida</label>
                      <input type="time" id="time" {...register("time", { required: "La hora es requerida para un turno"})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                      {errors.time && <span className="text-red-500 text-sm mt-1">{errors.time.message}</span>}
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={checkAvailability}
                      disabled={isChecking}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isChecking ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5"
                          >
                            <Clock size={20} />
                          </motion.div>
                          Verificando...
                        </>
                      ) : (
                        <>
                          <Calendar size={20} /> Verificar Disponibilidad
                        </>
                      )}
                    </button>
                    {renderAvailabilityMessage()}
                  </div>
                </motion.div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea id="message" rows={4} {...register("message", { required: "Dejanos tu consulta" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></textarea>
                {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message.message}</span>}
              </div>
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 bg-pink-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-500 transition-transform duration-300 hover:scale-105 disabled:bg-pink-300 disabled:cursor-not-allowed"
                disabled={contactType === 'appointment' && availability !== 'available'}
              >
                <Send size={20} /> 
                {contactType === 'appointment' ? 'Enviar Solicitud de Turno' : 'Enviar Consulta'}
              </button>
              {contactType === 'appointment' && availability !== 'available' && (
                <p className="text-xs text-center text-gray-500">Por favor, verificá un horario disponible para poder enviar la solicitud.</p>
              )}
            </form>
          </MotionDiv>
          <MotionDiv
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
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Contact;
