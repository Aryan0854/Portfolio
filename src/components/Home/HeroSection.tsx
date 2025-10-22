import React, { useEffect, useRef, useState } from 'react';
import { Github as GitHub, Linkedin, Mail, PhoneCall, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profileData } from '../../data/profileData';
import ImageLoader from '../UI/ImageLoader';

const HeroSection: React.FC = () => {
  const { name, title, bio, contact } = profileData;
  const nameArray = name.split(' ');
  const heroRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  
  useEffect(() => {
    if (!heroRef.current) return;
    
    const hero = heroRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = hero.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      const content = hero.querySelector('.hero-content') as HTMLElement;
      
      if (content) {
        content.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
      }
    };
    
    hero.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const copyPhoneNumber = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(contact.phone);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy phone number:', err);
    }
  };
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-16 z-20"
    >
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <PhoneCall size={18} />
          <span>Phone number copied to clipboard!</span>
        </div>
      )}
      
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center hero-content">
        <div className="md:order-1 order-2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="block text-white mb-2">Hi, I'm</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
              {nameArray[0]} <span className="block md:inline">{nameArray[1]}</span>
            </span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-gray-300 mb-6">{title}</h2>
          
          <p className="text-gray-400 mb-8 max-w-lg">{bio}</p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full transition-colors duration-300 inline-flex items-center gap-2"
            >
              <Mail size={18} /> Contact Me
            </a>
            <Link
              to="/resume"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full transition-colors duration-300 inline-flex items-center gap-2"
            >
              View Resume
            </Link>
          </div>
          
          <div className="flex gap-4 justify-center md:justify-start">
            <a
              href={contact.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <GitHub size={24} />
            </a>
            <a
              href={contact.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            {contact.twitter && (
              <a
                href={contact.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
            )}
            {contact.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
            )}
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
            <a
              href="#"
              onClick={copyPhoneNumber}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Phone"
            >
              <PhoneCall size={24} />
            </a>
          </div>
        </div>
        
        <div className="md:order-2 order-1 flex justify-center relative">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full animate-pulse-slow blur-xl opacity-30"></div>
            <div className="absolute inset-2 bg-gray-900 rounded-full"></div>
            <ImageLoader
              src={profileData.avatar}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover rounded-full p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;