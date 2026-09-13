import React from 'react';

const FloatingActionCluster: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="fixed bottom-28 right-6 md:bottom-24 z-40 flex flex-col items-center gap-4 transition-transform duration-500 ease-out"
    >
      {children}
    </div>
  );
};

export default FloatingActionCluster;