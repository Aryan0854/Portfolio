import React from 'react';
import { Link } from 'react-router-dom';
import { Github as GitHub, Linkedin, Mail, MapPin, Twitter, Facebook } from 'lucide-react';
import { profileData } from '../../data/profileData';

const Footer: React.FC = () => {
  const { contact } = profileData;
  
  return (
    <footer className="relative z-10 bg-black/60 backdrop-blur-md border-t border-white/5 text-gray-300 py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 md:px-12 lg:px-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">Aryan Mishra</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              B.Tech Student specializing in AI & ML with a passion for developing intelligent, automated, and secure systems that drive real-world impact.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#6366f1] hover:translate-x-1 inline-block transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-[#6366f1] hover:translate-x-1 inline-block transition duration-300">
                  Resume
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="hover:text-[#6366f1] hover:translate-x-1 inline-block transition duration-300">
                  Certificates
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#6366f1] hover:translate-x-1 inline-block transition duration-300">
                  Projects
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#6366f1] shrink-0" />
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aryanofficial0854@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b5cf6] transition duration-300 break-all">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-[#6366f1] shrink-0" />
                <a href={contact.locationLink} className="hover:text-[#8b5cf6] transition duration-300" target="_blank" rel="noopener noreferrer">
                  {contact.location}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <GitHub size={15} className="text-[#6366f1] shrink-0" />
                <a href={contact.githubLink} className="hover:text-[#8b5cf6] transition duration-300 break-all" target="_blank" rel="noopener noreferrer">
                  {contact.github}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Linkedin size={15} className="text-[#6366f1] shrink-0" />
                <a href={contact.linkedinLink} className="hover:text-[#8b5cf6] transition duration-300 break-all" target="_blank" rel="noopener noreferrer">
                  {contact.linkedin}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Focus Areas</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Python', 'Machine Learning', 'Artificial Intelligence', 'React', 'TypeScript', 'Tailwind CSS', 'DevOps', 'Data Analytics'].map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-[#6366f1]/30 rounded-full text-xs text-gray-300 hover:text-white transition duration-300 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-10 pt-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Aryan Mishra. All rights reserved.</p>
          <div className="flex gap-4">
            {contact.twitter && (
              <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300" aria-label="Twitter">
                <Twitter size={16} />
              </a>
            )}
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;