import React, { useEffect, useRef, useState } from 'react';
import { Github as GitHub, Linkedin, Mail, PhoneCall, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profileData } from '../../data/profileData';
import ImageLoader from '../UI/ImageLoader';

const HeroSection: React.FC = () => {
  const { name, title, bio, contact } = profileData;
  const nameArray = name.split(' ');
  const heroRef = useRef<HTMLDivElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  // Custom typing animation for title
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(title.slice(0, index + 1));
      index++;
      if (index >= title.length) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [title]);

  // Mouse move effect for background parallax and 3D avatar tilt
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = hero.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      // Content shift
      const content = hero.querySelector('.hero-content') as HTMLElement;
      if (content) {
        const moveX = (x - 0.5) * 15;
        const moveY = (y - 0.5) * 15;
        content.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }

      // Avatar 3D tilt
      const avatar = avatarContainerRef.current;
      if (avatar) {
        const avatarRect = avatar.getBoundingClientRect();
        const avatarCenterX = avatarRect.left + avatarRect.width / 2;
        const avatarCenterY = avatarRect.top + avatarRect.height / 2;
        
        const tiltX = -(clientY - avatarCenterY) / (avatarRect.height / 2) * 15; // Max 15deg
        const tiltY = (clientX - avatarCenterX) / (avatarRect.width / 2) * 15;   // Max 15deg
        
        avatar.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
      }
    };

    const handleMouseLeave = () => {
      const avatar = avatarContainerRef.current;
      if (avatar) {
        avatar.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        avatar.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    };
    
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
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
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-10 z-20"
    >
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] border border-white/10 flex items-center gap-3 z-50 animate-scale-in">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <PhoneCall size={16} className="text-indigo-200" />
          </div>
          <div>
            <span className="font-semibold text-sm block">Phone Copied!</span>
            <span className="text-xs text-indigo-200">{contact.phone}</span>
          </div>
        </div>
      )}
      
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center hero-content transition-transform duration-300 ease-out">
        
        {/* Left Text details */}
        <div className="md:col-span-7 text-center md:text-left md:order-1 order-2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Available for Opportunities
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-none text-white">
            Hi, I'm <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-glow-indigo">
              {nameArray[0]} {nameArray[1]}
            </span>
          </h1>
          
          <div className="h-8 flex items-center justify-center md:justify-start">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-300 border-r-2 border-[#6366f1] pr-2 whitespace-nowrap overflow-hidden">
              {typedText}
            </h2>
          </div>
          
          <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
            {bio}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e3] hover:to-[#7c4ee4] text-white px-8 py-3.5 rounded-full transition-all duration-300 flex items-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.4)]"
            >
              <Mail size={18} className="group-hover:translate-x-0.5 transition-transform" />
              <span className="font-semibold text-sm">Contact Me</span>
            </a>
            <Link
              to="/resume"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 px-8 py-3.5 rounded-full transition-all duration-300 flex items-center gap-2 font-semibold text-sm"
            >
              <span>View Resume</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-3 justify-center md:justify-start pt-4">
            {[
              { icon: <GitHub size={20} />, link: contact.githubLink, label: 'GitHub' },
              { icon: <Linkedin size={20} />, link: contact.linkedinLink, label: 'LinkedIn' },
              { icon: <Twitter size={20} />, link: contact.twitter, label: 'Twitter' },
              { icon: <Facebook size={20} />, link: contact.facebook, label: 'Facebook' },
            ].filter(s => s.link).map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:border-[#6366f1]/50 hover:bg-[#6366f1]/10 flex items-center justify-center transition-all duration-300"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
            <a
              href="#"
              onClick={copyPhoneNumber}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:border-[#6366f1]/50 hover:bg-[#6366f1]/10 flex items-center justify-center transition-all duration-300"
              aria-label="Phone"
            >
              <PhoneCall size={20} />
            </a>
          </div>
        </div>
        
        {/* Right Avatar */}
        <div className="md:col-span-5 flex justify-center md:order-2 order-1">
          <div 
            ref={avatarContainerRef}
            className="relative w-64 h-64 sm:w-80 sm:h-80 transition-transform duration-300 ease-out"
            style={{ aspectRatio: '1/1' }}
          >
            {/* Pulsing Backing Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded-full animate-pulse-slow blur-2xl opacity-20"></div>
            
            {/* Outer Spinning Ring */}
            <div className="absolute inset-[-4px] rounded-full border-2 border-dashed border-[#6366f1]/30 animate-spin" style={{ animationDuration: '40s' }}></div>
            
            {/* Inner Glowing Ring */}
            <div className="absolute inset-[-10px] rounded-full border border-[#6366f1]/10 scale-95 animate-ping" style={{ animationDuration: '3s' }}></div>

            {/* Avatar Frame */}
            <div className="absolute inset-0 rounded-full overflow-hidden border border-white/10 bg-[#11151f] p-2 shadow-2xl">
              <ImageLoader
                src={profileData.avatar}
                alt={name}
                className="w-full h-full object-cover rounded-full"
                priority
                width={320}
                height={320}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;