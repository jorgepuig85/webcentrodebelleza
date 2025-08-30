import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

type As = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface AnimatedTitleProps {
  as: As;
  children: React.ReactNode;
  className?: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ as: Component, children, className }) => {
  const isMainTitle = Component === 'h1' || Component === 'h2';

  const subtitleVariants: Variants = {
    rest: { letterSpacing: 'normal' },
    hover: { letterSpacing: '0.05em' },
  };

  if (isMainTitle) {
    // For main titles, we use a CSS-based underline for performance and simplicity
    return (
      <div className="group inline-block cursor-pointer">
        <Component className={cn('animated-underline', className)}>
          {children}
        </Component>
      </div>
    );
  }

  // For subtitles, we use Framer Motion for the letter-spacing effect
  return (
    <motion.div
      variants={subtitleVariants}
      initial="rest"
      whileHover="hover"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="cursor-pointer inline-block"
    >
      <Component className={className}>
        {children}
      </Component>
    </motion.div>
  );
};

export default AnimatedTitle;
