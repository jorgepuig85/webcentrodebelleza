
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AnimatedTitle from './ui/AnimatedTitle';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Legal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          aria-labelledby="legal-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <MotionDiv
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-theme-background rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col"
            style={{ maxHeight: '90vh' }}
          >
            <header className="flex items-center justify-between p-6 border-b border-theme-border flex-shrink-0">
              <AnimatedTitle as="h2" id="legal-modal-title" className="text-2xl font-bold text-theme-text-strong">
                Información Legal
              </AnimatedTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </header>

            <div className="p-6 overflow-y-auto">
              <div className="prose max-w-none lg:prose-lg prose-headings:text-theme-text-strong prose-p:text-theme-text prose-strong:text-theme-text-strong prose-a:text-theme-primary hover:prose-a:text-theme-primary-hover">
                {/* Política de Privacidad */}
                <h3 className="!text-2xl !font-bold">Política de Privacidad</h3>
                <p>En <strong className="font-bold">www.centrodebelleza.com.ar</strong> valoramos tu confianza y la privacidad de tus datos. Por eso, hemos redactado esta política para que sepas exactamente cómo manejamos tu información.</p>
                
                <h4 className="!text-xl !font-bold">Recolección de Datos Personales</h4>
                <p>Recopilamos los datos que nos proporcionas <strong className="font-bold">voluntariamente</strong> a través de formularios en nuestro sitio, como tu nombre y correo electrónico. Estos datos son necesarios para que podamos responder a tus consultas, procesar tus solicitudes o enviarte la información que nos pidas.</p>

                <h4 className="!text-xl !font-bold">Uso de la Información</h4>
                <p>Los datos que nos brindes se utilizarán <strong className="font-bold">únicamente para los fines para los que fueron recopilados</strong>. No los usaremos para nada más. Por ejemplo, si te suscribes a nuestro newsletter, solo recibirás ese contenido.</p>

                <h4 className="!text-xl !font-bold">Protección y Confidencialidad</h4>
                <p><strong className="font-bold">Nunca compartiremos, venderemos o cederemos tus datos personales a terceros</strong>, a menos que la ley nos obligue a hacerlo. Tu información está segura con nosotros.</p>

                <h4 className="!text-xl !font-bold">Tus Derechos</h4>
                <p>En cualquier momento, tienes el <strong className="font-bold">derecho de acceder a los datos que tenemos sobre ti, corregirlos si son incorrectos o pedir que los eliminemos</strong>. Para ejercer estos derechos, simplemente escríbenos a <a href="mailto:notificaciones@centrodebelleza.com.ar">notificaciones@centrodebelleza.com.ar</a> y con gusto te ayudaremos.</p>

                <hr className="my-8" />

                {/* Términos y Condiciones */}
                <h3 className="!text-2xl !font-bold">Términos y Condiciones de Uso</h3>
                <p>Te damos la bienvenida a <strong className="font-bold">www.centrodebelleza.com.ar</strong>, al usar este sitio, aceptás los siguientes términos. Por favor, leelos con atención.</p>

                <h4 className="!text-xl !font-bold">Uso de nuestro sitio</h4>
                <p>El contenido de este sitio (textos, imágenes, productos) es solo para <strong className="font-bold">fines informativos y/o comerciales</strong>. Te comprometés a utilizar nuestro sitio de manera lícita, sin dañar, sobrecargar o perjudicar su funcionamiento.</p>

                <h4 className="!text-xl !font-bold">Propiedad Intelectual</h4>
                <p>Todo el contenido que ves en nuestro sitio, incluyendo textos, logotipos, imágenes, videos y gráficos, es <strong className="font-bold">propiedad exclusiva de centrodebelleza</strong>. No podés reproducir, modificar, distribuir o usar este material sin nuestra autorización previa y por escrito.</p>

                <h4 className="!text-xl !font-bold">Limitación de Responsabilidad</h4>
                <p>Si bien nos esforzamos por mantener nuestro sitio web libre de errores e interrupciones, no podemos garantizarlo. <strong className="font-bold">Usar este sitio y la información que contiene es tu responsabilidad</strong>. No seremos responsables por ningún daño que pudiera surgir del uso de la información o del sitio en sí.</p>

                <h4 className="!text-xl !font-bold">Modificaciones de los Términos</h4>
                <p>Nos reservamos el derecho de <strong className="font-bold">actualizar, cambiar o modificar estos términos en cualquier momento</strong>. Si hacemos cambios importantes, te lo haremos saber a través de un aviso en el sitio. Si seguís usando nuestro sitio después de estas modificaciones, significa que aceptás los nuevos términos.</p>
                
                <hr className="my-8" />

                {/* Política de Cookies */}
                <h3 className="!text-2xl !font-bold">Política de Cookies</h3>
                <p>En <strong className="font-bold">www.centrodebelleza.com.ar</strong>, usamos cookies para darte la mejor experiencia posible. Al continuar navegando, aceptas su uso de acuerdo con esta política.</p>

                <h4 className="!text-xl !font-bold">¿Qué son las cookies?</h4>
                <p>Las cookies son pequeños archivos de texto que tu navegador almacena en tu dispositivo (computadora, celular, etc.). Estas nos ayudan a <strong className="font-bold">"recordar" tu visita, como tus preferencias, y a que el sitio funcione mejor</strong>.</p>

                <h4 className="!text-xl !font-bold">Tipos de cookies que utilizamos</h4>
                <ul className="list-disc pl-5">
                  <li><strong className="font-bold">Que el sitio funcione:</strong> Las cookies técnicas son esenciales para que puedas navegar y usar las funciones básicas de nuestra web.</li>
                  <li><strong className="font-bold">Recordar tus preferencias:</strong> Las cookies de preferencia nos ayudan a recordar tu idioma o la región desde donde nos visitas.</li>
                  <li><strong className="font-bold">Analizar el uso del sitio:</strong> Las cookies de análisis, como las de Google Analytics, nos permiten saber cómo interactúas con nuestra web. Esto nos ayuda a entender qué te gusta y qué podemos mejorar.</li>
                </ul>

                <h4 className="!text-xl !font-bold">Tu control sobre las cookies</h4>
                <p><strong className="font-bold">Tú tienes el control</strong>. Si no quieres que usemos cookies, puedes configurar tu navegador para que las rechace o para que te avise antes de que se almacenen. Ten en cuenta que si desactivas ciertas cookies, algunas partes de nuestro sitio podrían no funcionar correctamente. Puedes gestionar tus preferencias en cualquier momento a través de la configuración de tu navegador.</p>

              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Legal;