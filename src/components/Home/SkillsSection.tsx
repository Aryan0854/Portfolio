import React from 'react';
import { profileData } from '../../data/profileData';
import SkillBar from '../UI/SkillBar';

const SkillsSection: React.FC = () => {
  const { skills } = profileData;
  
  return (
    <div className="py-16 bg-gray-900/50 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          My <span className="text-indigo-500">Skills</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <SkillBar key={index} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;