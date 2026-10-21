import React, { useEffect, useRef, useState } from 'react';
import { Github as GitHub, Linkedin, Mail, PhoneCall, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profileData } from '../../data/profileData';
import ImageLoader from '../UI/ImageLoader';

const HeroSection: React.FC = () => {
  const { name, title, contact } = profileData;
  const nameArray = name.split(' ');
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

  useEffect(() => {
    const avatar = avatarContainerRef.current;
    if (!avatar) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = avatar.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      avatar.style.transform = `perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
    };

    const handleMouseLeave = () => {
      avatar.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    avatar.addEventListener('mousemove', handleMouseMove);
    avatar.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      avatar.removeEventListener('mousemove', handleMouseMove);
      avatar.removeEventListener('mouseleave', handleMouseLeave);
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
  
  const socials = [
    { icon: <GitHub size={18} />, link: contact.githubLink, label: 'GitHub' },
    { icon: <Linkedin size={18} />, link: contact.linkedinLink, label: 'LinkedIn' },
    { icon: <Twitter size={18} />, link: contact.twitter, label: 'Twitter' },
    { icon: <Facebook size={18} />, link: contact.facebook, label: 'Facebook' },
  ].filter((social) => social.link);

  return (
    <div className="relative z-20 overflow-hidden py-1 md:flex md:min-h-[82vh] md:items-center md:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-12%] -top-6 bottom-0 -z-10 bg-[radial-gradient(ellipse_at_50%_38%,rgba(7,8,13,0.82)_0%,rgba(7,8,13,0.45)_46%,transparent_72%)] md:hidden"
      />

      {showToast && (
        <div className="fixed bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] left-4 right-4 z-50 flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] px-5 py-3 text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)] animate-scale-in sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <PhoneCall size={16} className="text-indigo-200" />
          </div>
          <div>
            <span className="block text-sm font-semibold">Phone Copied!</span>
            <span className="text-xs text-indigo-200">{contact.phone}</span>
          </div>
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-5 text-center md:grid md:grid-cols-12 md:items-center md:gap-12 md:text-left">
        <div className="order-1 md:order-2 md:col-span-5 md:flex md:justify-end">
          <div
            ref={avatarContainerRef}
            className="relative h-[9.25rem] w-[9.25rem] transition-transform duration-200 ease-out min-[420px]:h-40 min-[420px]:w-40 md:h-80 md:w-80"
            style={{ aspectRatio: '1/1', transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#a855f7] opacity-25 blur-2xl animate-pulse-slow" />
            <div className="absolute inset-[-5px] rounded-full border-2 border-dashed border-[#6366f1]/35 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute inset-[-12px] hidden rounded-full border border-[#6366f1]/15 animate-ping md:block" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 overflow-hidden rounded-full border border-white/15 bg-[#11151f] p-1.5 shadow-[0_12px_40px_rgba(99,102,241,0.28)] md:p-2">
              <ImageLoader
                src={profileData.avatar}
                alt="Aryan Mishra, AI and Machine Learning developer in Bengaluru"
                className="h-full w-full rounded-full object-cover"
                priority
                width={320}
                height={320}
              />
            </div>
          </div>
        </div>

        <div className="relative order-2 flex w-full flex-col items-center gap-3.5 md:order-1 md:col-span-7 md:items-start md:gap-6">
          <div className="pointer-events-none absolute -inset-10 -z-10 hidden rounded-full bg-[#07080d]/55 blur-3xl md:block" />

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for opportunities
          </div>

          <h1 className="text-[2.05rem] font-extrabold leading-[0.92] tracking-tight text-white min-[390px]:text-4xl sm:text-5xl lg:text-7xl">
            Hi, I'm <br />
            <span className="whitespace-nowrap bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {nameArray[0]} {nameArray[1]}
            </span>
          </h1>

          <div className="flex min-h-7 w-full items-center justify-center md:h-8 md:justify-start">
            <h2 className="max-w-full border-r-2 border-indigo-400 pr-2 text-[15px] font-semibold text-slate-200 sm:text-xl md:whitespace-nowrap">
              {typedText}
            </h2>
          </div>

          <p className="max-w-md text-[13.5px] font-light leading-relaxed text-slate-300 sm:text-base md:max-w-lg md:text-slate-400">
            Bengaluru-based AI &amp; ML developer building Python, React, and TypeScript products —
            from machine learning systems to full-stack automation.
            Final-year B.Tech in CS (AI/ML), open to ML, SDE, and full-stack roles.
          </p>

          <div className="grid w-full grid-cols-2 gap-2.5 pt-1 md:flex md:w-auto md:flex-wrap md:justify-start md:gap-4 md:pt-2">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex touch-manipulation items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-3 py-3.5 text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)] transition-all duration-300 hover:from-[#5558e3] hover:to-[#7c4ee4] hover:shadow-[0_4px_30px_rgba(99,102,241,0.4)] active:scale-[0.98] md:rounded-lg md:px-7 md:py-3"
            >
              <Mail size={18} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              <span className="text-[13px] font-semibold sm:text-sm">Contact Me</span>
            </a>
            <Link
              to="/resume"
              className="flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-3.5 text-[13px] font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/5 active:scale-[0.98] sm:text-sm md:rounded-lg md:bg-transparent md:px-7 md:py-3"
            >
              <span>View Resume</span>
              <ArrowRight size={16} className="shrink-0" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-1 md:justify-start md:gap-3 md:pt-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-white/25 hover:text-white active:scale-95 md:h-9 md:w-9 md:border-transparent md:bg-transparent md:text-slate-400"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
            <a
              href="#"
              onClick={copyPhoneNumber}
              className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-white/25 hover:text-white active:scale-95 md:h-9 md:w-9 md:border-transparent md:bg-transparent md:text-slate-400"
              aria-label="Phone"
            >
              <PhoneCall size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;