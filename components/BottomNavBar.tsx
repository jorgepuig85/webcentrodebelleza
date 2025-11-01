import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Sparkles, Calendar } from 'lucide-react';

const BottomNavBar: React.FC = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/servicios', icon: ClipboardList, label: 'Servicios' },
    { path: '/promociones', icon: Sparkles, label: 'Promos' },
    { path: '/contacto', icon: Calendar, label: 'Reservar' },
  ];

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
      isActive ? 'text-theme-primary' : 'text-theme-text-light hover:text-theme-primary'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-theme-background/80 backdrop-blur-sm border-t border-theme-border/50 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] z-40">
      <div className="grid grid-cols-4 h-full">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={getLinkClass}
            // End prop for the home route to avoid it being active for all routes
            end={path === '/'}
          >
            <Icon size={24} strokeWidth={1.5} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
