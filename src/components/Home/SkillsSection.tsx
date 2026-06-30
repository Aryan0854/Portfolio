import React from 'react';
import { profileData } from '../../data/profileData';
import SkillBar from '../UI/SkillBar';

const SkillsSection: React.FC = () => {
  const { skills } = profileData;
  
  return (
    <div className="py-20 relative z-10">
      <div className="w-full">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Technical <span className="text-indigo-400 text-glow-indigo">Skills</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] mx-auto rounded-full"></div>
          <p className="text-gray-400 text-sm sm:text-base">
            Expertise in machine learning algorithms, full-stack software development, and automation pipelines.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {skills.map((skill, index) => (
            <SkillBar key={index} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;