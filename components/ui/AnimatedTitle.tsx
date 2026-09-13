import React from 'react';
import { cn } from '../../lib/utils';

type As = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface AnimatedTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as: As;
  children: React.ReactNode;
  className?: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ as: Component, children, className, ...rest }) => {
  const isMainTitle = Component === 'h1' || Component === 'h2';

  if (isMainTitle) {
    // For main titles, we use a CSS-based underline for performance and simplicity
    return (
      <div className="group inline-block cursor-pointer">
        <Component className={cn('animated-underline', className)} {...rest}>
          {children}
        </Component>
      </div>
    );
  }

  // For subtitles, we use pure CSS transition for smooth hover letter-spacing without heavy JS runtime
  return (
    <div className="cursor-pointer inline-block transition-[letter-spacing] duration-300 ease-out hover:tracking-wider">
      <Component className={className} {...rest}>
        {children}
      </Component>
    </div>
  );
};

export default AnimatedTitle;