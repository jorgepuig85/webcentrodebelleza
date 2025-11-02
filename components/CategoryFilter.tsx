import React from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onSelectCategory }) => {
  // Hide scrollbar but keep functionality. Add padding to see masked edges.
  const scrollbarHide = {
    '::-webkit-scrollbar': { display: 'none' },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  };

  return (
    <div className="relative">
        <div 
            className="flex flex-nowrap gap-2 overflow-x-auto pb-2 -mb-2"
            style={{ 
                ...scrollbarHide,
                // Gradient mask for scroll indication
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
        >
            <button
                onClick={() => onSelectCategory('Todos')}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 relative ${
                activeCategory === 'Todos'
                    ? 'text-theme-primary'
                    : 'text-theme-text hover:text-theme-primary'
                }`}
            >
                Todos
                {activeCategory === 'Todos' && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-primary"
                    layoutId="category-underline"
                />
                )}
            </button>
            {categories.map((category) => (
                <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 relative ${
                    activeCategory === category
                    ? 'text-theme-primary'
                    : 'text-theme-text hover:text-theme-primary'
                }`}
                >
                {category}
                {activeCategory === category && (
                    <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-primary"
                    layoutId="category-underline"
                    />
                )}
                </button>
            ))}
        </div>
    </div>
  );
};

export default CategoryFilter;