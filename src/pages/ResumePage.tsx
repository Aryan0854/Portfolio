import React from 'react';
import Layout from '../components/Layout/Layout';
import { profileData } from '../data/profileData';
import { Download, Briefcase, GraduationCap, Award, User, Mail, Phone, MapPin, Linkedin, Github as GitHub } from 'lucide-react';
import SkillBar from '../components/UI/SkillBar';

const ResumePage: React.FC = () => {
  const { name, title, bio, contact, skills, experiences, education } = profileData;
  
  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = import.meta.env.BASE_URL + 'CV.pdf'; // Use BASE_URL to reference local file
    link.download = 'Aryan_Mishra_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Layout hideParticles>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Resume</h1>
          
          <button
            onClick={downloadResume}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 inline-flex items-center gap-2"
          >
            <Download size={18} /> Download Resume
          </button>
        </div>
        
        {/* Resume Preview - Dark version of the image shown */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
          {/* Header */}
          <div className="border-b border-gray-700 pb-6 mb-6">
            <h2 className="text-3xl font-bold text-white">{name}</h2>
            <p className="text-indigo-400 text-xl mb-4">{title}</p>
            
            <p className="text-gray-300 mb-6">{bio}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Mail size={16} className="text-indigo-400" />
                <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-indigo-700 text-gray-300"
            >
              <>aryanofficial0854@gmail.com</>
            </a>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Phone size={16} className="text-indigo-400" />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(contact.phone);
                    
                    // Create and show toast notification
                    const toast = document.createElement('div');
                    toast.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50';
                    toast.style.animation = 'fadeIn 0.3s ease-in-out';
                    
                    const phoneIcon = document.createElement('div');
                    phoneIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
                    
                    const message = document.createElement('span');
                    message.textContent = 'Phone number copied to clipboard!';
                    
                    toast.appendChild(phoneIcon);
                    toast.appendChild(message);
                    document.body.appendChild(toast);
                    
                    // Remove toast after 3 seconds
                    setTimeout(() => {
                      if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                      }
                    }, 3000);
                  }}
                  className="hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {contact.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} className="text-indigo-400" />
                <a href={contact.locationLink} className="hover:text-indigo-300 transition-colors"
                target="_blank">
                  {contact.location}
                </a>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Linkedin size={16} className="text-indigo-400" />
                <a href={contact.linkedinLink} className="hover:text-indigo-300 transition-colors"
                target="_blank">
                  {contact.linkedin}
                </a>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <GitHub size={16} className="text-indigo-400" />
                <a href={contact.githubLink} className="hover:text-indigo-300 transition-colors"
                target="_blank">
                  {contact.github}
                </a>
              </div>
            </div>
          </div>
          
          {/* Summary Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="text-indigo-400" /> Summary
            </h3>
            <p className="text-gray-300">{bio}</p>
          </div>
          
          {/* Professional Experience */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="text-indigo-400" /> Professional Experience
            </h3>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="border-l-2 border-indigo-500 pl-4">
                  <h4 className="text-lg font-semibold text-white">{exp.title}</h4>
                  <p className="text-indigo-300 mb-1">{exp.company}</p>
                  <p className="text-gray-400 text-sm mb-2">{exp.period}</p>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Education */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="text-indigo-400" /> Education
            </h3>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-indigo-500 pl-4">
                  <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                  <p className="text-indigo-300 mb-1">{edu.institution}</p>
                  <p className="text-gray-400 text-sm mb-2">{edu.period}</p>
                  <p className="text-gray-300">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Skills */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="text-indigo-400" /> Skills
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {skills.map((skill, index) => (
                <SkillBar key={index} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumePage;