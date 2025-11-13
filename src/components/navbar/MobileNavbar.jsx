// src/components/MobileNavbar.jsx
/* eslint-disable react/prop-types */
import { Home, ChefHat, Coffee, User, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MobileNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine current page from pathname
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path.startsWith('/makanan')) return 'makanan';
    if (path.startsWith('/minuman')) return 'minuman';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };
  
  const currentPage = getCurrentPage();
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'makanan', label: 'Makanan', icon: ChefHat },
    { id: 'minuman', label: 'Minuman', icon: Coffee },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Floating Create Button */}
      <button
        onClick={() => navigate('/create-recipe')}
        className="md:hidden fixed bottom-20 right-4 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-1 z-50">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id === 'home' ? '' : item.id}`)}
              className={`flex flex-col items-center py-2 px-3 transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <IconComponent 
                size={20} 
                className="mb-1"
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
    </>
  );
}

