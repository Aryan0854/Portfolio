import React from 'react';
import { profileData } from '../../data/profileData';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';

const ExperienceSection: React.FC = () => {
  const { experiences, education } = profileData;
  
  return (
    <div className="py-20 relative z-10 bg-black/20">
      <div className="w-full">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Journey & <span className="text-indigo-400 text-glow-indigo">History</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] mx-auto rounded-full"></div>
          <p className="text-gray-400 text-sm sm:text-base">
            Internships, academic milestones, and cloud associate experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Experience Column */}
          <div className="space-y-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 px-2">
              <span className="p-2.5 rounded-xl bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20">
                <Briefcase size={20} />
              </span>
              Work Experience
            </h3>
            
            <div className="relative pl-6 border-l border-white/10 ml-5 space-y-6">
              {experiences.map((experience, index) => (
                <div key={index} className="relative group">
                  {/* Timeline Node */}
                  <span className="absolute -left-[33px] top-[26px] w-4 h-4 rounded-full bg-[#6366f1] border-4 border-[#0b0e14] group-hover:scale-125 group-hover:bg-[#8b5cf6] transition-all duration-300"></span>
                  
                  {/* Glass Card */}
                  <div className="glass-card p-6 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-lg font-bold text-white group-hover:text-[#6366f1] transition-colors">{experience.title}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-[#6366f1] font-semibold">
                        <Calendar size={13} />
                        <span>{experience.period}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 font-semibold">{experience.company}</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-light">{experience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Education Column */}
          <div className="space-y-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 px-2">
              <span className="p-2.5 rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20">
                <GraduationCap size={20} />
              </span>
              Education History
            </h3>
            
            <div className="relative pl-6 border-l border-white/10 ml-5 space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="relative group">
                  {/* Timeline Node */}
                  <span className="absolute -left-[33px] top-[26px] w-4 h-4 rounded-full bg-[#8b5cf6] border-4 border-[#0b0e14] group-hover:scale-125 group-hover:bg-[#6366f1] transition-all duration-300"></span>
                  
                  {/* Glass Card */}
                  <div className="glass-card p-6 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-lg font-bold text-white group-hover:text-[#8b5cf6] transition-colors">{edu.degree}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-[#8b5cf6] font-semibold">
                        <Calendar size={13} />
                        <span>{edu.period}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 font-semibold">{edu.institution}</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-light">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;