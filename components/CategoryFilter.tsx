import React from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      <button
        onClick={() => onSelectCategory('Todos')}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 relative ${
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
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 relative ${
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
  );
};

export default CategoryFilter;
