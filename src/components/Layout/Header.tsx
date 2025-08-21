import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-2xl relative z-50">
          <span className="text-indigo-500">ARYAN</span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link 
            to="/" 
            className={`text-gray-300 hover:text-white transition duration-300 ${
              isActive('/') ? 'font-bold text-white border-b-2 border-indigo-500' : ''
            }`}
          >
            Home
          </Link>
          <Link 
            to="/resume" 
            className={`text-gray-300 hover:text-white transition duration-300 ${
              isActive('/resume') ? 'font-bold text-white border-b-2 border-indigo-500' : ''
            }`}
          >
            Resume
          </Link>
          <Link 
            to="/certificates" 
            className={`text-gray-300 hover:text-white transition duration-300 ${
              isActive('/certificates') ? 'font-bold text-white border-b-2 border-indigo-500' : ''
            }`}
          >
            Certificates
          </Link>
          <Link 
            to="/projects" 
            className={`text-gray-300 hover:text-white transition duration-300 ${
              isActive('/projects') ? 'font-bold text-white border-b-2 border-indigo-500' : ''
            }`}
          >
            Projects
          </Link>
        </nav>
        
        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white focus:outline-none relative z-50"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <Menu size={24} className="text-white" />
          )}
        </button>
        
        {/* Mobile menu */}
        <div className={`
          fixed inset-0 bg-black/95 backdrop-blur-lg md:hidden z-40 transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl">
            <Link 
              to="/" 
              className={`text-gray-300 hover:text-white transition duration-300 transform hover:scale-105 ${
                isActive('/') ? 'font-bold text-white' : ''
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/resume" 
              className={`text-gray-300 hover:text-white transition duration-300 transform hover:scale-105 ${
                isActive('/resume') ? 'font-bold text-white' : ''
              }`}
              onClick={closeMenu}
            >
              Resume
            </Link>
            <Link 
              to="/certificates" 
              className={`text-gray-300 hover:text-white transition duration-300 transform hover:scale-105 ${
                isActive('/certificates') ? 'font-bold text-white' : ''
              }`}
              onClick={closeMenu}
            >
              Certificates
            </Link>
            <Link 
              to="/projects" 
              className={`text-gray-300 hover:text-white transition duration-300 transform hover:scale-105 ${
                isActive('/projects') ? 'font-bold text-white' : ''
              }`}
              onClick={closeMenu}
            >
              Projects
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;