import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4 md:px-8">
      <div className={`mx-auto max-w-5xl rounded-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/55 backdrop-blur-lg border border-white/10 shadow-lg px-6 py-2.5' 
          : 'bg-[#11151f]/30 backdrop-blur-md border border-white/5 px-6 py-3.5'
      } flex justify-between items-center relative`}>
        
        <Link to="/" className="text-white font-extrabold text-xl tracking-wider hover:opacity-85 transition-opacity">
          <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent">ARYAN</span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {[
            { name: 'Home', path: '/' },
            { name: 'Resume', path: '/resume' },
            { name: 'Certificates', path: '/certificates' },
            { name: 'Projects', path: '/projects' },
          ].map((item) => (
            <Link 
              key={item.name}
              to={item.path} 
              className={`relative py-1 px-3 text-sm tracking-wide transition-all duration-300 font-medium ${
                isActive(item.path) 
                  ? 'text-indigo-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.name}
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>
        
        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white focus:outline-none p-1.5 rounded-full hover:bg-white/10 transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        {/* Mobile menu panel */}
        <div className={`
          absolute left-0 right-0 top-16 bg-black/90 backdrop-blur-xl md:hidden z-40 transform transition-all duration-300 ease-in-out rounded-3xl
          ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible pointer-events-none'}
        `} style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-col items-center justify-center py-8 space-y-6 text-lg">
            {[
              { name: 'Home', path: '/' },
              { name: 'Resume', path: '/resume' },
              { name: 'Certificates', path: '/certificates' },
              { name: 'Projects', path: '/projects' },
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className={`text-base tracking-wide transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'font-bold text-indigo-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;