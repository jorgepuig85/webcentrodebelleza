
import React, { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, Phone, MapPin, Instagram, Mail, AlertCircle, CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

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

const MotionDiv = motion.div;

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

  const contactType = watch('contactType');
  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const selectedZoneNames = watch('zones');

  const [zones, setZones] = useState<Zone[]>([]);
  const [totalCost, setTotalCost] = useState(0);
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
  useEffect(() => {
    if (zones.length > 0 && selectedZoneNames?.length > 0) {
      const cost = selectedZoneNames.reduce((acc, zoneName) => {
        const selectedZone = zones.find(z => z.name === zoneName);
        return acc + (selectedZone?.price || 0);
      }, 0);
      setTotalCost(cost);
    } else {
      setTotalCost(0);
    }
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

  const onInquirySubmit: SubmitHandler<FormInputs> = data => {
    const subject = encodeURIComponent(`Consulta desde la web de ${data.name}`);
    const body = encodeURIComponent(`Nombre: ${data.name}\nWhatsApp: ${data.whatsapp}\n\nMensaje:\n${data.message}`);
    window.location.href = `mailto:yani.2185@gmail.com?subject=${subject}&body=${body}`;
    reset();
  };

  const onAppointmentSubmit: SubmitHandler<FormInputs> = async (data) => {
    setFormStatus('loading');
    setStatusMessage('');
    try {
        // All submissions now go through the secure API route
        const response = await fetch('/api/book-appointment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          let errorMsg = 'Ocurrió un error al agendar el turno.';
          try {
            const errorData = await response.json();
            // Use the 'message' field for rate-limiting errors (429), or 'error' for others.
            errorMsg = errorData.message || errorData.error || `Error del servidor: ${response.status}`;
          } catch (jsonError) {
            // If response is not JSON, use the status text as a fallback.
            errorMsg = `Error de comunicación con el servidor (${response.statusText || response.status}).`;
          }
          throw new Error(errorMsg);
        }

        await response.json();
        setFormStatus('success');
        setStatusMessage('¡Tu turno fue solicitado con éxito! Recibirás un email con los detalles y te contactaremos para confirmar.');
      
      reset({ contactType: 'appointment', name: '', email: '', phone: '', date: '', time: '', zones: [], message: '' });
      setAvailableTimes([]);

    } catch (error: any) {
      setFormStatus('error');
      setStatusMessage(error.message);
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
                    ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-pink-100'}
                    ${isSelected ? 'bg-pink-500 text-white font-bold' : 'text-gray-700'}
                `}
            >
                {day}
            </button>
        );
    });

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20}/></button>
          <span className="font-semibold text-lg capitalize">{currentMonth.toLocaleString('es-AR', { month: 'long', year: 'numeric' })}</span>
          <button type="button" onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={20}/></button>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-gray-500 mb-2">
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
        return <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-md">Seleccioná una fecha para ver los horarios.</div>;
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
       return <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-md">No hay horarios disponibles para este día.</div>;
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
                                ${isAvailable && !isSelected ? 'bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400' : ''}
                                ${isSelected ? 'bg-pink-500 text-white border-pink-500 ring-2 ring-pink-300' : ''}
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
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Contactanos</h2>
          <p className="text-lg text-gray-500 mt-2">Resolvé tus dudas o agendá tu próxima visita.</p>
          <div className="mt-4 w-24 h-1 bg-pink-400 mx-auto rounded"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <MotionDiv
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Envianos tu Mensaje</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiero...</label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="inquiry" {...register("contactType")} className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300"/>
                    Hacer una Consulta
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="appointment" {...register("contactType")} className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300"/>
                    Agendar un Turno
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input type="text" id="name" {...register("name", { required: "El nombre es requerido" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
              </div>

              {contactType === 'inquiry' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">Número de WhatsApp</label>
                    <input type="tel" id="whatsapp" {...register("whatsapp", { required: "El WhatsApp es requerido" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                    {errors.whatsapp && <span className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</span>}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                    <textarea id="message" rows={4} {...register("message", { required: "Dejanos tu consulta" })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></textarea>
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" {...register("email", { required: "El email es requerido para confirmar", pattern: { value: /^\S+@\S+$/i, message: "Formato de email inválido" } })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                    {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono/WhatsApp (Opcional)</label>
                    <input type="tel" id="phone" {...register("phone")} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">1. Elegí una fecha</label>
                        <input type="hidden" {...register("date", { required: "La fecha es requerida" })} />
                        <Calendar/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">2. Elegí un horario</label>
                         <input type="hidden" {...register("time", { required: "La hora es requerida" })} />
                        <TimeSlots/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">3. Zonas a tratar</label>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded-md border">
                      {zones.length > 0 ? zones.map(zone => (
                        <label key={zone.id} className="flex items-center gap-2 cursor-pointer text-sm">
                          <input type="checkbox" value={zone.name} {...register("zones", { required: "Seleccioná al menos una zona" })} className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"/>
                          {zone.name}
                        </label>
                      )) : <span className="text-sm text-gray-500">Cargando zonas...</span>}
                    </div>
                     {errors.zones && <span className="text-red-500 text-sm mt-1">{errors.zones.message}</span>}
                  </div>
                  
                  {totalCost > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg text-right"
                    >
                      <span className="text-sm font-medium text-gray-600">Costo Total Estimado:</span>
                      <span className="text-2xl font-bold text-pink-500 ml-3">
                        ${totalCost.toLocaleString('es-AR')}
                      </span>
                    </motion.div>
                  )}

                   <div>
                    <label htmlFor="appointment_message" className="block text-sm font-medium text-gray-700">Mensaje adicional (Opcional)</label>
                    <textarea id="appointment_message" rows={3} {...register("message")} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></textarea>
                  </div>
                </motion.div>
              )}

              {renderStatusMessage()}
              
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 bg-pink-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-500 transition-transform duration-300 hover:scale-105 disabled:bg-pink-300 disabled:cursor-not-allowed"
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
              <div className="space-y-4">
                 <a href="https://wa.me/5492954391448?text=Hola!%20Quisiera%20hacer%20una%20consulta." target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 hover:text-pink-500 transition-colors">
                  <Phone className="w-6 h-6 text-pink-400" />
                  <span>+54 9 2954 39-1448</span>
                </a>
                <a href="mailto:yani.2185@gmail.com" className="flex items-center gap-4 text-gray-600 hover:text-pink-500 transition-colors">
                    <Mail className="w-6 h-6 text-pink-400" />
                    <span>yani.2185@gmail.com</span>
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
                height="300"
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