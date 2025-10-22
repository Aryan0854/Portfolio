import React from 'react';
import { Github as GitHub, Linkedin, Mail, MapPin, Twitter, Facebook } from 'lucide-react';
import { profileData } from '../../data/profileData';

const Footer: React.FC = () => {
  const { contact } = profileData;
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Aryan Mishra</h3>
            <p className="mb-4 text-gray-400">B.Tech Student specializing in AI & ML with a passion for developing intelligent solutions with real-world impact.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white transition duration-300">Home</a></li>
              <li><a href="/resume" className="hover:text-white transition duration-300">Resume</a></li>
              <li><a href="/certificates" className="hover:text-white transition duration-300">Certificates</a></li>
              <li><a href="/projects" className="hover:text-white transition duration-300">Projects</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-indigo-400" />
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aryanofficial0854@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-300">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-indigo-400" />
                <a href={contact.locationLink} className="hover:text-white transition duration-300" target="_blank">
                  {contact.location}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <GitHub size={16} className="text-indigo-400" />
                <a href={contact.githubLink} className="hover:text-white transition duration-300" target="_blank" rel="noopener noreferrer">
                  {contact.github}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin size={16} className="text-indigo-400" />
                <a href={contact.linkedinLink} className="hover:text-white transition duration-300" target="_blank" rel="noopener noreferrer">
                  {contact.linkedin}
                </a>
              </li>
              {contact.twitter && (
                <li className="flex items-center gap-2">
                  <Twitter size={16} className="text-indigo-400" />
                  <a href={contact.twitter} className="hover:text-white transition duration-300" target="_blank" rel="noopener noreferrer">
                    x.com/Aryan000980805
                  </a>
                </li>
              )}
              {contact.facebook && (
                <li className="flex items-center gap-2">
                  <Facebook size={16} className="text-indigo-400" />
                  <a href={contact.facebook} className="hover:text-white transition duration-300" target="_blank" rel="noopener noreferrer">
                    facebook.com/Aryan0804
                  </a>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Skills</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-900/60 rounded-full text-sm">Python</span>
              <span className="px-3 py-1 bg-blue-900/60 rounded-full text-sm">Machine Learning</span>
              <span className="px-3 py-1 bg-purple-900/60 rounded-full text-sm">AI</span>
              <span className="px-3 py-1 bg-teal-900/60 rounded-full text-sm">JavaScript</span>
              <span className="px-3 py-1 bg-cyan-900/60 rounded-full text-sm">Java</span>
              <span className="px-3 py-1 bg-sky-900/60 rounded-full text-sm">HTML/CSS</span>
              <span className="px-3 py-1 bg-violet-900/60 rounded-full text-sm">C</span>
              <span className="px-3 py-1 bg-violet-900/60 rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-violet-900/60 rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-violet-900/60 rounded-full text-sm">Chart.js</span>
              <span className="px-3 py-1 bg-violet-900/60 rounded-full text-sm">Vite</span>
              <span className="px-3 py-1 bg-violet-900/60 rounded-full text-sm">Tailwind CSS</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Aryan Mishra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;