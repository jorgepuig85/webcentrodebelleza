
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Promotions from './components/Promotions';
import Technology from './components/Technology';
import Rental from './components/Rental';
import Testimonials from './components/Testimonials';
import Locations from './components/Locations';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

const App: React.FC = () => {
  return (
    <div className="bg-white text-gray-700">
      <Header />
      <main>
        <Hero />
        <Services />
        <Promotions />
        <Technology />
        <Rental />
        <Testimonials />
        <Locations />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;