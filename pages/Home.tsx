import React from 'react';
import Hero from '../components/Hero';
import ServicesPreview from '../components/ServicesPreview';
import PromotionsPreview from '../components/PromotionsPreview';
import TechnologyPreview from '../components/TechnologyPreview';
import TestimonialsPreview from '../components/TestimonialsPreview';
import LocationsPreview from '../components/LocationsPreview';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <PromotionsPreview />
      <TechnologyPreview />
      <TestimonialsPreview />
      <LocationsPreview />
    </>
  );
};

export default Home;