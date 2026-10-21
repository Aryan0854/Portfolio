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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
        isScrolled || isMenuOpen ? 'bg-[#07080d]/85 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="flex h-16 w-full items-center justify-between px-5 sm:h-[72px] sm:px-10 lg:px-16 xl:px-24">
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
          className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-white/[0.06] bg-[#07080d]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
          <div className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex min-h-12 items-center justify-between rounded-xl px-3 text-[15px] tracking-wide ${
                  isActive(item.path) ? 'bg-white/[0.05] font-semibold text-white' : 'text-slate-300'
                }`}
              >
                {item.name}
                {isActive(item.path) && <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
