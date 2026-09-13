import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Resume', path: '/resume' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'Projects', path: '/projects' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-[#07080d]/80 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 h-16 sm:h-[72px] flex items-center justify-between">
        <Link to="/" className="text-white font-extrabold text-lg tracking-[0.2em] hover:opacity-80 transition-opacity">
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            ARYAN
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative text-[13px] tracking-wide transition-colors duration-200 font-medium ${
                isActive(item.path) ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.name}
              {isActive(item.path) && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
              )}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-white p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#07080d]/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`py-3 text-sm tracking-wide border-b border-white/[0.04] last:border-0 ${
                  isActive(item.path) ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
