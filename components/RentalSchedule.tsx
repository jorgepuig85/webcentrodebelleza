
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

type Rental = {
  start_date: string;
  end_date: string;
  location: {
    name: string;
    // FIX: The Supabase join returns an array of locations, so this type is updated to reflect that.
  }[] | null;
};

// Map from "YYYY-MM-DD" to location name
type RentalMap = {
  [date: string]: string;
};

const RentalScheduleSkeleton = () => (
  <div className="bg-theme-background p-6 rounded-lg shadow-md animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 w-10 bg-gray-200 rounded-full"></div>
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="h-6 w-10 bg-gray-200 rounded-full"></div>
    </div>
    <div className="grid grid-cols-7 text-center text-sm font-semibold mb-2">
        {[...Array(7)].map((_, i) => <div key={i} className="h-5 w-8 mx-auto bg-gray-200 rounded"></div>)}
    </div>
    <div className="grid grid-cols-7 gap-1">
      {[...Array(35)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded"></div>
      ))}
    </div>
  </div>
);

const RentalSchedule: React.FC = () => {
  const [rentals, setRentals] = useState<RentalMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date();
        today.setMonth(today.getMonth() - 2); // Fetch last 2 months as well for context
        const fromDate = today.toISOString().split('T')[0];

        const { data, error: fetchError } = await supabase
          .from('rentals')
          .select('start_date, end_date, location:locations (name)')
          .gte('start_date', fromDate);

        if (fetchError) throw fetchError;

        if (data) {
          const rentalMap: RentalMap = {};
          (data as Rental[]).forEach(rental => {
            // Adjust for timezone differences by parsing as UTC
            const startDate = new Date(rental.start_date + 'T00:00:00Z');
            const endDate = new Date(rental.end_date + 'T00:00:00Z');
            // FIX: Access the first element of the location array to get the location name.
            const locationName = rental.location?.[0]?.name || 'Ubicación no especificada';

            for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
              const dateString = d.toISOString().split('T')[0];
              rentalMap[dateString] = locationName;
            }
          });
          setRentals(rentalMap);
        }
      } catch (err) {
        console.error("Error fetching rental schedule:", err);
        setError('No se pudo cargar la agenda. Intente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = (firstDayOfMonth.getDay() + 6) % 7; // 0 for Monday

    const calendarDays = Array.from({ length: startingDay + daysInMonth }, (_, i) => {
        if (i < startingDay) return <div key={`empty-${i}`} className="border-r border-b border-theme-border/10"></div>;
        
        const day = i - startingDay + 1;
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const rentalLocation = rentals[dateString];
        const isBooked = !!rentalLocation;

        return (
            <div
                key={i}
                className={`relative group p-2 border-r border-b border-theme-border/10 min-h-[5rem] sm:min-h-[6rem] transition-colors duration-200
                    ${isBooked ? 'bg-theme-primary-soft' : 'bg-white hover:bg-theme-background-soft'}
                `}
            >
                <span className={`text-sm sm:text-base font-medium ${isBooked ? 'text-theme-primary font-bold' : 'text-theme-text'}`}>
                    {day}
                </span>
                {isBooked && (
                    <>
                        <div className="absolute inset-0 bg-theme-primary opacity-10 pointer-events-none"></div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-sm font-medium text-theme-text-inverted bg-theme-text-strong rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                            {`Alquilado en: ${rentalLocation}`}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-theme-text-strong rotate-45" />
                        </div>
                    </>
                )}
            </div>
        );
    });

    const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-theme-border/20">
            <div className="flex justify-between items-center p-4 border-b border-theme-border/20">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-theme-background-soft" aria-label="Mes anterior"><ChevronLeft size={24} className="text-theme-primary"/></button>
                <span className="text-lg sm:text-xl font-bold capitalize text-theme-text-strong">{currentMonth.toLocaleString('es-AR', { month: 'long', year: 'numeric' })}</span>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-theme-background-soft" aria-label="Siguiente mes"><ChevronRight size={24} className="text-theme-primary"/></button>
            </div>
            <div className="grid grid-cols-7">
                {weekdays.map(day => (
                    <div key={day} className="text-center text-xs sm:text-sm font-semibold text-theme-text p-2 border-b border-r border-theme-border/10 bg-theme-background-soft">{day}</div>
                ))}
                {calendarDays}
            </div>
        </div>
    );
  };
  
  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      // FIX: Add `as const` to the ease property to satisfy TypeScript's type requirements for Framer Motion Variants.
      transition={{ duration: 0.7, ease: "easeOut" as const }}
    >
      <div className="text-center mb-8">
        <AnimatedTitle as="h3" className="text-3xl font-bold text-theme-text-strong">Agenda de Disponibilidad</AnimatedTitle>
        <p className="text-lg text-theme-text mt-2">Consultá las fechas en las que nuestro equipo ya está reservado.</p>
      </div>
      
      {loading && <RentalScheduleSkeleton />}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      {!loading && !error && renderCalendar()}
      
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-theme-text">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-theme-primary-soft border border-theme-primary"></div>
            <span>Día Alquilado</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RentalSchedule;
