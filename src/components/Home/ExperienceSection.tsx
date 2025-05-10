import React from 'react';
import { profileData } from '../../data/profileData';
import { Briefcase, GraduationCap } from 'lucide-react';

const ExperienceSection: React.FC = () => {
  const { experiences, education } = profileData;
  
  return (
    <div className="py-16 bg-gray-900/50 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Experience & <span className="text-indigo-500">Education</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Experience Column */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Briefcase className="text-indigo-400" /> Professional Experience
            </h3>
            
            <div className="space-y-8">
              {experiences.map((experience, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-indigo-500 ml-3">
                  <div className="absolute w-4 h-4 bg-indigo-500 rounded-full -left-[0.6rem]"></div>
                  
                  <div className="bg-gray-800/40 backdrop-blur-sm p-5 rounded-lg shadow-lg">
                    <h4 className="text-xl font-semibold text-white">{experience.title}</h4>
                    <p className="text-indigo-300 mb-2">{experience.company}</p>
                    <p className="text-gray-400 text-sm mb-3">{experience.period}</p>
                    <p className="text-gray-300">{experience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Education Column */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <GraduationCap className="text-indigo-400" /> Education
            </h3>
            
            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-indigo-500 ml-3">
                  <div className="absolute w-4 h-4 bg-indigo-500 rounded-full -left-[0.6rem]"></div>
                  
                  <div className="bg-gray-800/40 backdrop-blur-sm p-5 rounded-lg shadow-lg">
                    <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
                    <p className="text-indigo-300 mb-2">{edu.institution}</p>
                    <p className="text-gray-400 text-sm mb-3">{edu.period}</p>
                    <p className="text-gray-300">{edu.description}</p>
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