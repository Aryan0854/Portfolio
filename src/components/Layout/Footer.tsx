import React from 'react';
import { Link } from 'react-router-dom';
import { Github as GitHub, Linkedin, Mail, MapPin, Twitter, Facebook } from 'lucide-react';
import { profileData } from '../../data/profileData';

const Footer: React.FC = () => {
  const { contact } = profileData;

  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-black/40 backdrop-blur-md text-slate-400 py-14">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
              Aryan Mishra
            </h3>
            <p className="text-sm leading-relaxed text-slate-400 font-light">
              Final-year B.Tech student building AI systems, full-stack products, and automation that ships.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-white tracking-wide">Navigate</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/resume', label: 'Resume' },
                { to: '/certificates', label: 'Certificates' },
                { to: '/projects', label: 'Projects' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-white tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-indigo-400 shrink-0" />
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors break-all"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={14} className="text-indigo-400 shrink-0" />
                <a href={contact.locationLink} className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  {contact.location}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <GitHub size={14} className="text-indigo-400 shrink-0" />
                <a href={contact.githubLink} className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  {contact.github}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Linkedin size={14} className="text-indigo-400 shrink-0" />
                <a href={contact.linkedinLink} className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  {contact.linkedin}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-white tracking-wide">Focus</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Python', 'Machine Learning', 'AI', 'React', 'TypeScript', 'DevOps', 'Data Analytics'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded-full text-[11px] text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-10 pt-6 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Aryan Mishra. All rights reserved.</p>
          <div className="flex gap-4">
            {contact.twitter && (
              <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={15} />
              </a>
            )}
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
