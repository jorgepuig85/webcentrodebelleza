import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import FloatingActionCluster from '../components/FloatingActionCluster';
import { ThemeProvider } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Sparkles, 
  User, 
  Users, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  Tag,
  ShieldCheck
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_combo: boolean;
  zones?: string[] | null;
}

const FAQS_PRECIOS = [
  {
    question: '¿Los precios publicados son por sesión o por tratamiento completo?',
    answer: 'Los precios son por sesión individual. Se abona en cada visita sin necesidad de pagar contratos anuales por adelantado.'
  },
  {
    question: '¿Por qué hay listas diferenciadas para Mujer y Hombre?',
    answer: 'La densidad y grosor folicular masculino suele requerir mayor cantidad de disparos y tiempo de sesión en determinadas zonas, por lo que adaptamos la tarifa a la cobertura real de cada tratamiento.'
  },
  {
    question: '¿Qué incluye cada sesión de depilación láser?',
    answer: 'Incluye la evaluación de la piel previa, aplicación del gel conductor neutro, sesión con cabezal frío a -4°C que insensibiliza la zona y recomendaciones post-sesión.'
  },
  {
    question: '¿Cuáles son las formas de pago?',
    answer: 'Efectivo, transferencia bancaria instantánea y pagos con tarjeta o dinero en cuenta a través de Mercado Pago.'
  }
];

export const PreciosApp: React.FC = () => {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGender, setActiveGender] = useState<'woman' | 'man'>('woman');
  const [viewMode, setViewMode] = useState<'all' | 'zones' | 'combos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrecios = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('items')
          .select('id, name, description, price, image_url, is_combo, zones')
          .order('name', { ascending: true });

        if (error) throw error;
        if (data) {
          setItems(data as ServiceItem[]);
        }
      } catch (err) {
        console.error('Error fetching precios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrecios();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Filtrado por género
  const genderFiltered = items.filter((item) => {
    const nameLower = item.name.toLowerCase();
    if (activeGender === 'woman') {
      return nameLower.startsWith('mujer - ') || nameLower.startsWith('unisex - ') || (!nameLower.startsWith('hombre - ') && item.is_combo);
    } else {
      return nameLower.startsWith('hombre - ') || nameLower.startsWith('unisex - ');
    }
  });

  // Filtrado por tipo (Zonas / Combos)
  const typeFiltered = genderFiltered.filter((item) => {
    if (viewMode === 'zones') return !item.is_combo;
    if (viewMode === 'combos') return item.is_combo;
    return true;
  });

  // Filtrado por búsqueda
  const displayedItems = typeFiltered.filter((item) => {
    if (!searchQuery.trim()) return true;
    const cleanName = item.name.replace(/^(Mujer - |Hombre - |Unisex - )/i, '');
    return cleanName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const combos = displayedItems.filter(i => i.is_combo);
  const individualZones = displayedItems.filter(i => !i.is_combo);

  return (
    <ThemeProvider>
      <div className="bg-theme-background text-theme-text min-h-screen flex flex-col selection:bg-pink-100 selection:text-pink-900">
        <Header />

        <main className="flex-grow pt-24 pb-16">
          {/* Header Hero */}
          <section className="relative overflow-hidden pt-10 pb-14 border-b border-theme-border/50">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-50/50 via-transparent to-transparent pointer-events-none" />
            
            <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-100 text-pink-700 border border-pink-200 mb-5">
                <Tag className="w-3.5 h-3.5 text-pink-600" />
                <span>Tarifas Oficiales y Transparentes • Santa Rosa & Miguel Riglos</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-theme-text-strong tracking-tight max-w-4xl mx-auto leading-[1.15] mb-5">
                Precios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">Depilación Láser</span>
              </h1>

              <p className="text-lg text-theme-text-light max-w-2xl mx-auto leading-relaxed mb-8">
                Consultá los valores actualizados por zona individual o ahorrá con nuestros combos promocionales de múltiples áreas.
              </p>

              {/* Selector de Género (Mujer / Hombre) */}
              <div className="inline-flex items-center p-1.5 bg-gray-100 rounded-full max-w-sm w-full border border-gray-200/80 shadow-inner">
                <button
                  onClick={() => setActiveGender('woman')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300 ${
                    activeGender === 'woman'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Para Mujeres</span>
                </button>

                <button
                  onClick={() => setActiveGender('man')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300 ${
                    activeGender === 'man'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Para Hombres</span>
                </button>
              </div>
            </div>
          </section>

          {/* Filtros de Vista y Barra de Búsqueda */}
          <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 py-4 shadow-sm">
            <div className="container mx-auto px-6 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Filtro por tipo */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    viewMode === 'all'
                      ? 'bg-pink-100 text-pink-700 border border-pink-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos ({displayedItems.length})
                </button>
                <button
                  onClick={() => setViewMode('combos')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    viewMode === 'combos'
                      ? 'bg-pink-100 text-pink-700 border border-pink-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Combos Promo
                </button>
                <button
                  onClick={() => setViewMode('zones')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    viewMode === 'zones'
                      ? 'bg-pink-100 text-pink-700 border border-pink-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Zonas Individuales
                </button>
              </div>

              {/* Input de Búsqueda Rápida */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar zona (ej. Axilas)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Listado / Tablas de Precios */}
          <section className="py-12">
            <div className="container mx-auto px-6 max-w-5xl">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : displayedItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 mb-3">No se encontraron servicios con el filtro seleccionado.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setViewMode('all'); }}
                    className="text-pink-600 font-semibold text-sm hover:underline"
                  >
                    Restablecer filtros
                  </button>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* Bloque de Combos Destacados */}
                  {combos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-pink-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Paquetes y Combos Promocionales</h2>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {combos.map((combo) => {
                          const cleanName = combo.name.replace(/^(Mujer - |Hombre - |Unisex - )/i, '');
                          const whatsappConsultUrl = `https://wa.me/5492954391448?text=${encodeURIComponent(
                            `Hola! Quisiera reservar o consultar sobre el combo ${cleanName} ($${combo.price.toLocaleString('es-AR')}).`
                          )}`;

                          return (
                            <div 
                              key={combo.id}
                              className="bg-gradient-to-br from-pink-50/60 to-white p-6 rounded-2xl border border-pink-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-4 mb-2">
                                  <h3 className="font-bold text-lg text-gray-900">{cleanName}</h3>
                                  <span className="text-2xl font-extrabold text-pink-600 shrink-0">
                                    ${combo.price.toLocaleString('es-AR')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                  {combo.description || 'Tratamiento combinado para máxima efectividad y ahorro.'}
                                </p>
                              </div>
                              <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
                                <span className="text-xs text-pink-700 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Precio por sesión
                                </span>
                                <a
                                  href={whatsappConsultUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full transition-colors"
                                >
                                  <span>Reservar</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tabla Semántica Nativa de Zonas Individuales */}
                  {individualZones.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Zonas Individuales</h2>
                        <span className="text-xs text-gray-500 font-medium">
                          Mostrando {individualZones.length} zonas
                        </span>
                      </div>

                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                              <th className="py-3.5 px-6">Zona del Cuerpo</th>
                              <th className="py-3.5 px-6 hidden sm:table-cell">Detalle</th>
                              <th className="py-3.5 px-6 text-right">Precio por Sesión</th>
                              <th className="py-3.5 px-6 text-center">Turno</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                            {individualZones.map((zone) => {
                              const cleanName = zone.name.replace(/^(Mujer - |Hombre - |Unisex - )/i, '');
                              const whatsappConsultUrl = `https://wa.me/5492954391448?text=${encodeURIComponent(
                                `Hola! Quisiera consultar o solicitar turno para ${cleanName} ($${zone.price.toLocaleString('es-AR')}).`
                              )}`;

                              return (
                                <tr key={zone.id} className="hover:bg-pink-50/30 transition-colors">
                                  <td className="py-4 px-6 font-semibold text-gray-900">
                                    {cleanName}
                                  </td>
                                  <td className="py-4 px-6 text-gray-500 text-xs hidden sm:table-cell max-w-xs truncate">
                                    {zone.description || 'Sesión con tecnología cabezal frío'}
                                  </td>
                                  <td className="py-4 px-6 text-right font-bold text-pink-600 text-base">
                                    ${zone.price.toLocaleString('es-AR')}
                                  </td>
                                  <td className="py-4 px-6 text-center">
                                    <a
                                      href={whatsappConsultUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center p-2 rounded-full text-pink-600 hover:bg-pink-100 transition-colors"
                                      title={`Consultar por ${cleanName}`}
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Preguntas Frecuentes sobre Tarifas */}
          <section className="py-16 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-6 max-w-3xl">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Preguntas Frecuentes sobre Tarifas y Pagos
                </h2>
                <p className="text-sm text-gray-600">
                  Todo lo que necesitás saber antes de iniciar tu tratamiento.
                </p>
              </div>

              <div className="space-y-3">
                {FAQS_PRECIOS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 focus:outline-none"
                      >
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-pink-600' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-2">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
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

export default PreciosApp;
