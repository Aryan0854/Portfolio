import React from 'react';
import { Skill } from '../../types';

interface SkillBarProps {
  skill: Skill;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill }) => {
  // Function to determine color based on skill type
  const getBarColor = (skillName: string): string => {
    const skillLower = skillName.toLowerCase();
    
    if (skillLower.includes('python') || skillLower.includes('machine learning') || skillLower.includes('artificial intelligence')) {
      return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    } else if (skillLower.includes('java')) {
      return 'bg-gradient-to-r from-red-500 to-orange-500';
    } else if (skillLower.includes('javascript') || skillLower.includes('html') || skillLower.includes('css')) {
      return 'bg-gradient-to-r from-yellow-400 to-amber-500';
    } else if (skillLower.includes('c')) {
      return 'bg-gradient-to-r from-purple-500 to-violet-600';
    }
    
    return 'bg-gradient-to-r from-teal-400 to-cyan-500';
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-white font-medium">{skill.name}</span>
        <span className="text-gray-300">{skill.level}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${getBarColor(skill.name)} transition-all duration-1000 ease-out`} 
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;