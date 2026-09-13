import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import FloatingActionCluster from '../components/FloatingActionCluster';
import { ThemeProvider } from '../context/ThemeContext';
import RentalSchedule from '../components/RentalSchedule';
import { 
  Sparkles, 
  Truck, 
  GraduationCap, 
  ShieldCheck, 
  ChevronDown, 
  CalendarClock, 
  ArrowRight,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

const FAQS = [
  {
    question: '¿Cómo puedo reservar una fecha mientras la plataforma online se termina de configurar?',
    answer: 'Podés contactarnos directamente por WhatsApp al +54 9 2954 39-1448. Te compartimos el calendario actual de fechas libres, coordinamos la entrega y reservamos tu jornada de inmediato.'
  },
  {
    question: '¿Qué incluye la jornada de alquiler del equipo?',
    answer: 'El servicio incluye el traslado del equipo hasta tu centro o consultorio en Santa Rosa y localidades cercanas, calibración técnica, lentes de protección para operadora y paciente, y soporte técnico permanente durante toda la jornada.'
  },
  {
    question: '¿Es necesaria experiencia previa para operar el equipo?',
    answer: 'Requerimos acreditación o título afín en estética/salud. Si es la primera vez que trabajás con este modelo, coordinamos una inducción previa y te facilitamos los protocolos y fichas de consentimiento.'
  },
  {
    question: '¿Cuáles son las modalidades de alquiler disponibles?',
    answer: 'Ofrecemos alquiler por jornada completa (12 horas) o media jornada, con tarifas preferenciales para fechas fijas recurrentes cada mes.'
  }
];

export const AlquilerApp: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const whatsappLink = 'https://wa.me/5492954391448?text=' + encodeURIComponent(
    'Hola! Quisiera consultar fechas disponibles y condiciones para alquilar el equipo de depilación láser para mi centro de estética.'
  );

  return (
    <ThemeProvider>
      <div className="bg-theme-background text-theme-text min-h-screen flex flex-col selection:bg-pink-100 selection:text-pink-900">
        <Header />

        <main className="flex-grow pt-24 pb-16">
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-12 pb-20 border-b border-theme-border/50">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-50/40 via-transparent to-transparent pointer-events-none" />
            
            <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-100/80 text-pink-700 border border-pink-200/60 mb-6 backdrop-blur-sm">
                <CalendarClock className="w-3.5 h-3.5 text-pink-600" />
                <span>División B2B para Profesionales • Próximamente Reserva Online</span>
              </div>

              {/* Titular */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-theme-text-strong tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
                Alquiler de Equipos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">Depilación Láser</span> por Jornada
              </h1>

              <p className="text-lg sm:text-xl text-theme-text-light max-w-2xl mx-auto leading-relaxed mb-10">
                Estamos finalizando nuestra nueva plataforma de autogestión y calendario en vivo. Mientras tanto, podés consultar disponibilidad y asegurar tu fecha directamente con nuestro equipo.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-theme-primary text-theme-text-inverted px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-theme-primary-hover transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Consultar Fechas por WhatsApp</span>
                </a>
                <a
                  href="/#inicio"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-theme-border bg-white text-theme-text font-semibold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <span>Volver al Inicio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

          {/* Ventajas para Profesionales */}
          <section className="py-20 bg-theme-background-soft border-b border-theme-border/50">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-theme-text-strong mb-4">
                  Todo lo que tu centro necesita para facturar más
                </h2>
                <p className="text-theme-text-light">
                  Equipamiento de primer nivel para brindar sesiones efectivas y seguras sin necesidad de comprar la máquina.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-5">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-theme-text-strong mb-2">Tecnología de Punta</h3>
                  <p className="text-sm text-theme-text-light leading-relaxed">
                    Cabezal frío a -4°C que anestesia la zona al contacto, garantizando tratamientos indoloros y seguros.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-5">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-theme-text-strong mb-2">Traslado Incluido</h3>
                  <p className="text-sm text-theme-text-light leading-relaxed">
                    Llevamos el equipo hasta tu espacio en Santa Rosa y zonas de influencia, calibrado y listo para usar.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-5">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-theme-text-strong mb-2">Capacitación y Soporte</h3>
                  <p className="text-sm text-theme-text-light leading-relaxed">
                    Te brindamos protocolos clínicos, sugerencias de parámetros y asesoramiento constante durante tu día de atención.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-5">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-theme-text-strong mb-2">Garantía Operativa</h3>
                  <p className="text-sm text-theme-text-light leading-relaxed">
                    Mantenimiento preventivo certificado con cada jornada para que jamás tengas interrupciones con tus pacientes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Calendario de Ocupación en Vivo */}
          <section className="py-16 bg-white border-b border-theme-border/50">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="text-center mb-10">
                <span className="text-xs uppercase tracking-widest text-pink-600 font-bold bg-pink-50 px-3 py-1 rounded-full">
                  Disponibilidad de la Máquina
                </span>
                <h2 className="text-3xl font-bold text-theme-text-strong mt-3 mb-2">
                  Calendario de Ocupación Actual
                </h2>
                <p className="text-sm text-theme-text-light max-w-xl mx-auto">
                  Consultá las fechas ya reservadas en cada localidad. Los días libres podés solicitarlos de forma prioritaria.
                </p>
              </div>

              <div className="bg-theme-background-soft rounded-2xl p-4 sm:p-6 border border-theme-border/60 shadow-sm">
                <RentalSchedule />
              </div>
            </div>
          </section>

          {/* Preguntas Frecuentes (FAQ / AEO) */}
          <section className="py-20">
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-theme-text-strong mb-3">
                  Preguntas Frecuentes sobre el Alquiler
                </h2>
                <p className="text-theme-text-light">
                  Respuestas claras sobre los requisitos, logística y condiciones del servicio.
                </p>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div 
                      key={index} 
                      className="border border-theme-border rounded-xl bg-white overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 focus:outline-none"
                      >
                        <span className="font-semibold text-theme-text-strong text-base">
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-pink-600' : ''}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 pt-1 text-sm text-theme-text-light leading-relaxed border-t border-gray-50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Banner de contacto final */}
              <div className="mt-14 p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tenés una fecha en mente para tu centro?</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
                  Escribinos indicando tu localidad y te confirmamos disponibilidad en menos de 2 horas hábiles.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full font-semibold text-sm shadow hover:bg-pink-700 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Consultar Disponibilidad Inmediata</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <FloatingActionCluster>
          <FloatingWhatsApp />
        </FloatingActionCluster>
      </div>
    </ThemeProvider>
  );
};

export default AlquilerApp;
