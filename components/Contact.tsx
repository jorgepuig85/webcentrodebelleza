

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Send, Instagram, AlertCircle, CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import AnimatedTitle from './ui/AnimatedTitle';

// Types
type FormInputs = {
  contactType: 'inquiry' | 'appointment';
  name: string;
  whatsapp: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  zones: string[];
  message: string;
};

type Zone = {
  id: string;
  name: string;
  price: number;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const headerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const contentContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
}

const contentItemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};


const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, trigger } = useForm<FormInputs>({
    defaultValues: {
      contactType: 'inquiry',
      name: '',
      whatsapp: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      zones: [],
      message: '',
    },
  });

  const { executeRecaptcha } = useGoogleReCaptcha();
  const contactType = watch('contactType');
  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const selectedZoneNames = watch('zones');

  const [zones, setZones] = useState<Zone[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isFetchingTimes, setIsFetchingTimes] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch treatment zones for checkboxes
  useEffect(() => {
    const fetchZones = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('id, name, price')
        .eq('is_combo', false)
        .order('name');
      
      if (error) {
        console.error("Error fetching zones:", error);
      } else if (data) {
        setZones(data as Zone[]);
      }
    };
    fetchZones();
  }, []);

  // Calculate total cost when selected zones or available zones change
  const totalCost = useMemo(() => {
    if (!zones || zones.length === 0 || !selectedZoneNames || selectedZoneNames.length === 0) {
      return 0;
    }
    return selectedZoneNames.reduce((acc, zoneName) => {
      const selectedZone = zones.find(z => z.name === zoneName);
      return acc + (selectedZone?.price || 0);
    }, 0);
  }, [selectedZoneNames, zones]);


  // Fetch available times when date changes by calling the secure API endpoint
  useEffect(() => {
    if (contactType === 'appointment' && selectedDate) {
      const fetchAvailability = async () => {
        setIsFetchingTimes(true);
        setAvailableTimes([]);
        setValue('time', '');
        try {
          const response = await fetch(`/api/get-availability?date=${selectedDate}`);
          if (!response.ok) {
            throw new Error('No se pudo conectar con el servidor para obtener los horarios.');
          }
          const data = await response.json();
          setAvailableTimes(data.availableSlots || []);
        } catch (error) {
          console.error("Error fetching availability via API:", error);
          setAvailableTimes([]);
        } finally {
          setIsFetchingTimes(false);
        }
      };
      fetchAvailability();
    }
  }, [selectedDate, contactType, setValue]);

  const onInquirySubmit: SubmitHandler<FormInputs> = async (data) => {
    setFormStatus('loading');
    setStatusMessage('');

    if (!executeRecaptcha) {
        console.error('reCAPTCHA no está listo.');
        setFormStatus('error');
        setStatusMessage('Error de reCAPTCHA. Por favor, recargá la página e intentalo de nuevo.');
        return;
    }

    try {
        const recaptchaToken = await executeRecaptcha('sendInquiry');

        const response = await fetch('/api/send-inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, recaptchaToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ocurrió un error al enviar la consulta.');
        }

        await response.json();
        setFormStatus('success');
        setStatusMessage('¡Tu consulta fue enviada con éxito! Te responderemos a la brevedad.');
      
        reset({
            contactType: 'inquiry',
            name: '',
            whatsapp: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            zones: [],
            message: '',
        });

    } catch (error) {
      setFormStatus('error');
      const message = error instanceof Error ? error.message : 'Hubo un problema al enviar tu mensaje. Por favor, intentá de nuevo más tarde.';
      setStatusMessage(message);
    }
  };

  const onAppointmentSubmit: SubmitHandler<FormInputs> = async (data) => {
    setFormStatus('loading');
    setStatusMessage('');

    if (!executeRecaptcha) {
        console.error('reCAPTCHA no está listo.');
        setFormStatus('error');
        setStatusMessage('Error de reCAPTCHA. Por favor, recargá la página e intentalo de nuevo.');
        return;
    }

    try {
        const recaptchaToken = await executeRecaptcha('bookAppointment');

        const response = await fetch('/api/book-appointment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, recaptchaToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ocurrió un error al agendar el turno.');
        }

        await response.json();
        setFormStatus('success');
        setStatusMessage('¡Tu turno fue solicitado con éxito! Recibirás un email con los detalles y te contactaremos para confirmar.');
      
        reset({ contactType: 'appointment', name: '', email: '', phone: '', date: '', time: '', zones: [], message: '' });
        setAvailableTimes([]);

    } catch (error) {
      setFormStatus('error');
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setStatusMessage(message);
    }
  };


  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    setFormStatus('idle'); // reset status before new submission
    if (data.contactType === 'appointment') {
      onAppointmentSubmit(data);
    } else {
      onInquirySubmit(data);
    }
  };

  const renderStatusMessage = () => {
    if (formStatus === 'idle' || !statusMessage) return null;

    const isSuccess = formStatus === 'success';
    const Icon = isSuccess ? CheckCircle : AlertCircle;
    const colorClass = isSuccess ? 'green' : 'red';
    
    return (
      <div className={`mt-4 flex items-start gap-2 text-${colorClass}-700 bg-${colorClass}-50 p-3 rounded-md text-sm`}>
        <Icon size={20} className="flex-shrink-0 mt-0.5" />
        <span>{statusMessage}</span>
      </div>
    );
  };
  
  const Calendar = () => {
    // Get today's date at midnight UTC to prevent timezone issues
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // Use UTC methods for all date calculations
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const startingDay = (firstDayOfMonth.getUTCDay() + 6) % 7; // 0 for Monday

    const handleDateSelect = (day: number) => {
      const date = new Date(Date.UTC(year, month, day));
      if (date < todayUTC) return; // Prevent selecting past dates in any timezone
      
      const dateString = date.toISOString().split('T')[0];
      setValue('date', dateString);
      trigger('date');
    };
    
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    
    const calendarDays = Array.from({ length: startingDay + daysInMonth }, (_, i) => {
        if (i < startingDay) return <div key={`empty-${i}`}></div>; // empty days
        
        const day = i - startingDay + 1;
        const date = new Date(Date.UTC(year, month, day));

        const isPast = date < todayUTC;
        const isSelected = selectedDate === date.toISOString().split('T')[0];
        
        return (
            <button
                type="button"
                key={i}
                onClick={() => handleDateSelect(day)}
                disabled={isPast}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors duration-200
                    ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-theme-primary-soft'}
                    ${isSelected ? 'bg-theme-primary text-theme-text-inverted font-bold' : 'text-theme-text-strong'}
                `}
            >
                {day}
            </button>
        );
    });

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={prevMonth} className="p-2 rounded-full hover:bg-theme-background-soft"><ChevronLeft size={20}/></button>
          <span className="font-semibold text-lg capitalize">{currentMonth.toLocaleString('es-AR', { month: 'long', year: 'numeric' })}</span>
          <button type="button" onClick={nextMonth} className="p-2 rounded-full hover:bg-theme-background-soft"><ChevronRight size={20}/></button>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-theme-text mb-2">
            <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
        </div>
        <div className="grid grid-cols-7 gap-y-2 justify-items-center">
            {calendarDays}
        </div>
        {errors.date && <span className="text-red-500 text-sm mt-2 block">{errors.date.message}</span>}
      </div>
    );
  };
  
  const TimeSlots = () => {
    const ALL_POSSIBLE_TIMES = useMemo(() => 
        Array.from({length: 14}, (_, i) => `${String(i + 7).padStart(2, '0')}:00`), []); // 07:00 to 20:00

    if (!selectedDate) {
        return <div className="text-center text-sm text-theme-text bg-theme-background-soft p-4 rounded-md">Seleccioná una fecha para ver los horarios.</div>;
    }
    
    if (isFetchingTimes) {
        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {ALL_POSSIBLE_TIMES.map(time => (
                    <div key={time} className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
            </div>
        );
    }
    
    if (availableTimes.length === 0) {
       return <div className="text-center text-sm text-theme-text bg-theme-background-soft p-4 rounded-md">No hay horarios disponibles para este día.</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {ALL_POSSIBLE_TIMES.map(time => {
                    const isAvailable = availableTimes.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                        <button
                            type="button"
                            key={time}
                            disabled={!isAvailable}
                            onClick={() => {
                                if (isAvailable) {
                                    setValue('time', time);
                                    trigger('time');
                                }
                            }}
                            className={`p-2 rounded-md text-sm font-medium transition-all duration-200 border
                                ${!isAvailable ? 'bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed' : ''}
                                ${isAvailable && !isSelected ? 'bg-theme-background border-theme-border hover:bg-theme-background-soft hover:border-gray-400' : ''}
                                ${isSelected ? 'bg-theme-primary text-theme-text-inverted border-theme-primary ring-2 ring-theme-primary/50' : ''}
                            `}
                        >
                            {time} hs
                        </button>
                    );
                })}
            </div>
            {errors.time && <span className="text-red-500 text-sm mt-2 block">{errors.time.message}</span>}
        </div>
    );
  };


  return (
    <section id="contacto" className="py-20 animated-gradient-background-soft">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerContainerVariants}
        >
          <motion.div variants={headerItemVariants}>
            <AnimatedTitle as="h2" className="text-3xl md:text-4xl font-bold text-theme-text-strong">Contactanos</AnimatedTitle>
          </motion.div>
          <motion.p variants={headerItemVariants} className="text-lg text-theme-text mt-2">Resolvé tus dudas o agendá tu próxima visita.</motion.p>
          <motion.div variants={headerItemVariants} className="mt-4 w-24 h-1 bg-theme-primary mx-auto rounded"></motion.div>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-start"
          variants={contentContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="bg-theme-background p-8 rounded-lg shadow-md"
            variants={contentItemVariants}
          >
            <AnimatedTitle as="h3" className="text-2xl font-bold text-theme-text-strong mb-6">Envianos tu Mensaje</AnimatedTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-strong mb-2">Quiero...</label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="inquiry" {...register("contactType")} className="focus:ring-theme-primary h-4 w-4 text-theme-primary border-theme-border"/>
                    Hacer una Consulta
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="appointment" {...register("contactType")} className="focus:ring-theme-primary h-4 w-4 text-theme-primary border-theme-border"/>
                    Agendar un Turno
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-theme-text-strong">Nombre Completo</label>
                <input type="text" id="name" {...register("name", { required: "El nombre es requerido" })} className="mt-1 block w-full px-3 py-2 bg-theme-background border border-theme-border rounded-md shadow-sm focus:outline-none focus:ring-theme-primary focus:border-theme-primary" />
                {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
              </div>

              {contactType === 'inquiry' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-theme-text-strong">Número de WhatsApp</label>
                    <input type="tel" id="whatsapp" {...register("whatsapp", { required: "El WhatsApp es requerido" })} className="mt-1 block w-full px-3 py-2 bg-theme-background border border-theme-border rounded-md shadow-sm focus:outline-none focus:ring-theme-primary focus:border-theme-primary" />
                    {errors.whatsapp && <span className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</span>}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-theme-text-strong">Mensaje</label>
                    <textarea id="message" rows={4} {...register("message", { required: "Dejanos tu consulta" })} className="mt-1 block w-full px-3 py-2 bg-theme-background border border-theme-border rounded-md shadow-sm focus:outline-none focus:ring-theme-primary focus:border-theme-primary"></textarea>
                    {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message.message}</span>}
                  </div>
                </motion.div>
              )}
              
              {contactType === 'appointment' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-theme-text-strong">Email</label>
                    <input type="email" id="email" {...register("email", { required: "El email es requerido para confirmar", pattern: { value: /^\S+@\S+$/i, message: "Formato de email inválido" } })} className="mt-1 block w-full px-3 py-2 bg-theme-background border border-theme-border rounded-md shadow-sm focus:outline-none focus:ring-theme-primary focus:border-theme-primary" />
                    {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-theme-text-strong">Teléfono/WhatsApp (Opcional)</label>
                    <input type="tel" id="phone" {...register("phone")} className="mt-1 block w-full px-3 py-2 bg-theme-background border border-theme-border rounded-md shadow-sm focus:outline-none focus:ring-theme-primary focus:border-theme-primary" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium text-theme-text-strong mb-2">1. Elegí una fecha</label>
                        <input type="hidden" {...register("date", { required: "La fecha es requerida" })} />
                        <Calendar/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-theme-text-strong mb-2">2. Elegí un horario</label>
                         <input type="hidden" {...register("time", { required: "La hora es requerida" })} />
                        <TimeSlots/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-text-strong mb-2">3. Zonas a tratar</label>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 max-h-48 overflow-y-auto bg-theme-background-soft p-3 rounded-md border">
                      {zones.length > 0 ? zones.map(zone => (
                        <label key={zone.id} className="flex items-center gap-2 cursor-pointer text-sm">
                          <input type="checkbox" value={zone.name} {...register("zones", { required: "Seleccioná al menos una zona" })} className="focus:ring-theme-primary h-4 w-4 text-theme-primary border-theme-border rounded"/>
                          {zone.name}
                        </label>
                      )) : <span className="text-sm text-theme-text">Cargando zonas...</span>}
                    </div>
                     {errors.zones && <span className="text-red-500 text-sm mt-1">{errors.zones.message}</span>}
                  </div>
                  
                  {totalCost > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-theme-primary-soft border border-theme-primary/20 rounded-lg text-right"
                    >
                      <span className="text-sm font-medium text-theme-text">Costo Total Estimado:</span>
                      <span className="text-2xl font-bold text-theme-primary ml-3">
                        ${totalCost.toLocaleString('es-AR')}
                      </span>
                    </motion.div>
                  )}

                   <div>
                    <label htmlFor="appointment_message" className="block text-sm font-medium text-theme-text-strong">Mensaje adicional (Opcional)</label>
                    <textarea id="appointment_message" rows={3} {...register("message")} className="mt-1 block w-full px-3 py-2 bg-theme-background border border-theme-border rounded-md shadow-sm focus:outline-none focus:ring-theme-primary focus:border-theme-primary"></textarea>
                  </div>
                </motion.div>
              )}

              {renderStatusMessage()}
              
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 bg-theme-primary text-theme-text-inverted px-6 py-3 rounded-full font-semibold hover:bg-theme-primary-hover disabled:bg-theme-primary/70 disabled:cursor-not-allowed seasonal-glow-hover animate-heartbeat"
                disabled={formStatus === 'loading'}
              >
                {formStatus === 'loading' ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {contactType === 'appointment' ? 'Agendar Turno' : 'Enviar Consulta'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
          
          <motion.div
            className="space-y-8"
            variants={contentItemVariants}
          >
            <div>
              <AnimatedTitle as="h3" className="text-xl font-semibold text-theme-text-strong mb-4">Seguinos en Redes</AnimatedTitle>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/centro_de_bellezays?igsh=N3IxanJicmJuOXc5" target="_blank" rel="noopener noreferrer" aria-label="Seguinos en Instagram" className="bg-theme-background-soft p-3 rounded-full text-theme-text hover:bg-theme-primary-soft hover:text-theme-primary transition-colors"><Instagram /></a>
              </div>
            </div>
            <div>
              <iframe
                title="Ubicación en Google Maps"
                src="https://maps.google.com/maps?q=-36.85295661306252,-63.68863452311219&hl=es&z=15&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-md"
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;