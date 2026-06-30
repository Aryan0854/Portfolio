import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { profileData } from '../data/profileData';
import { Download, Briefcase, GraduationCap, Award, User, Mail, Phone, MapPin, Linkedin, Github as GitHub, Twitter, Facebook, FileText, ExternalLink, PhoneCall } from 'lucide-react';
import SkillBar from '../components/UI/SkillBar';

const ResumePage: React.FC = () => {
  const { name, title, bio, contact, skills, experiences, education, publications } = profileData;
  const [showToast, setShowToast] = useState(false);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = import.meta.env.BASE_URL + 'CV.pdf'; // Use BASE_URL to reference local file
    link.download = 'Aryan_Mishra_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPhoneNumber = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(contact.phone);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  return (
    <Layout>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] border border-white/10 flex items-center gap-3 z-50 animate-scale-in">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <PhoneCall size={16} className="text-indigo-200" />
          </div>
          <div>
            <span className="font-semibold text-sm block">Phone Copied!</span>
            <span className="text-xs text-indigo-200">{contact.phone}</span>
          </div>
        </div>
      )}

      <div className="w-full py-8 space-y-8">
        
        {/* Title / Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="space-y-1.5 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Curriculum <span className="text-indigo-400 text-glow-indigo">Vitae</span></h1>
            <p className="text-xs text-gray-400 font-light">Interactive digital profile & credentials repository</p>
          </div>
          
          <button
            onClick={downloadResume}
            className="mx-auto sm:mx-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-[0_4px_15px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] shrink-0"
          >
            <Download size={16} /> Download Offline PDF
          </button>
        </div>
        
        {/* Dynamic Glass Resume Panel */}
        <div className="bg-[#11151f]/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl p-6 sm:p-10 space-y-10">
          
          {/* Header Card Details */}
          <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row gap-6 md:items-start justify-between">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{name}</h2>
              <p className="text-indigo-400 text-lg font-bold">{title}</p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl font-light">{bio}</p>
            </div>
            
            {/* Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5 shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-5 w-full md:w-auto">
              <div className="flex items-center gap-2.5 text-xs text-gray-300">
                <Mail size={14} className="text-indigo-400 shrink-0" />
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors break-all">
                  {contact.email}
                </a>
              </div>
              
              <div className="flex items-center gap-2.5 text-xs text-gray-300">
                <Phone size={14} className="text-indigo-400 shrink-0" />
                <a href="#" onClick={copyPhoneNumber} className="hover:text-indigo-300 transition-colors">
                  {contact.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-2.5 text-xs text-gray-300">
                <MapPin size={14} className="text-indigo-400 shrink-0" />
                <a href={contact.locationLink} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">
                  {contact.location}
                </a>
              </div>
              
              <div className="flex items-center gap-2.5 text-xs text-gray-300">
                <Linkedin size={14} className="text-indigo-400 shrink-0" />
                <a href={contact.linkedinLink} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors truncate max-w-[200px]">
                  {contact.linkedin}
                </a>
              </div>
              
              <div className="flex items-center gap-2.5 text-xs text-gray-300">
                <GitHub size={14} className="text-indigo-400 shrink-0" />
                <a href={contact.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors truncate max-w-[200px]">
                  {contact.github}
                </a>
              </div>
            </div>
          </div>
          
          {/* Professional Experience */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <Briefcase size={18} className="text-indigo-400" /> Professional Experience
            </h3>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="group relative pl-5 border-l-2 border-indigo-500/30 space-y-2">
                  {/* Indicator Dot */}
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform duration-300"></span>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{exp.title}</h4>
                    <span className="text-xs text-indigo-400 font-semibold">{exp.period}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-semibold">{exp.company}</p>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Publications */}
          {publications.length > 0 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
                <FileText size={18} className="text-indigo-400" /> Publications & Research
              </h3>
              
              <div className="space-y-6">
                {publications.map((pub, index) => (
                  <div key={index} className="group relative pl-5 border-l-2 border-indigo-500/30 space-y-2">
                    {/* Indicator Dot */}
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform duration-300"></span>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">{pub.title}</h4>
                      <span className="text-xs text-indigo-400 font-semibold shrink-0">{pub.period}</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed font-light">{pub.description}</p>
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-semibold mt-1"
                    >
                      <ExternalLink size={12} /> View Publication Citation
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <GraduationCap size={18} className="text-indigo-400" /> Education
            </h3>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="group relative pl-5 border-l-2 border-indigo-500/30 space-y-2">
                  {/* Indicator Dot */}
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform duration-300"></span>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{edu.degree}</h4>
                    <span className="text-xs text-indigo-400 font-semibold">{edu.period}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-semibold">{edu.institution}</p>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Skills Grid */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <Award size={18} className="text-indigo-400" /> Skill Competencies
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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