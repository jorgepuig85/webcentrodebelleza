import React from 'react';
import { motion } from 'framer-motion';

const FloatingActionCluster: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingActionCluster;
