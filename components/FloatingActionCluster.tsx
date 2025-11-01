import React from 'react';
import { motion } from 'framer-motion';

// FIX: Using motion factory function to potentially resolve TypeScript type inference issues.
const MotionDiv = motion.div;

const FloatingActionCluster: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MotionDiv
      className="fixed bottom-28 right-6 md:bottom-24 z-40 flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionDiv>
  );
};

export default FloatingActionCluster;