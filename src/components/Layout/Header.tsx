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
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
      <div
        className={`mx-auto max-w-6xl rounded-full transition-all duration-300 flex justify-between items-center relative ${
          isScrolled
            ? 'bg-[#07080d]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.45)] px-5 py-2'
            : 'bg-white/[0.04] backdrop-blur-md border border-white/[0.06] px-5 py-2.5'
        }`}
      >
        <Link to="/" className="text-white font-extrabold text-lg tracking-[0.18em] hover:opacity-80 transition-opacity">
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            ARYAN
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative px-3.5 py-1.5 text-[13px] tracking-wide rounded-full transition-all duration-300 font-medium ${
                isActive(item.path)
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div
          className={`absolute left-0 right-0 top-[calc(100%+10px)] md:hidden z-40 rounded-2xl border border-white/10 bg-[#07080d]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
            isMenuOpen
              ? 'opacity-100 translate-y-0 visible'
              : 'opacity-0 -translate-y-2 invisible pointer-events-none'
          }`}
        >
          <div className="flex flex-col py-3 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-3 rounded-xl text-sm tracking-wide transition-colors ${
                  isActive(item.path)
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
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
