import React from 'react';
import { Skill } from '../../types';

interface SkillBarProps {
  skill: Skill;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill }) => {
  // Determine color palette based on skill type
  const getSkillConfig = (skillName: string) => {
    const nameLower = skillName.toLowerCase();
    
    if (nameLower.includes('python') || nameLower.includes('machine learning') || nameLower.includes('artificial intelligence')) {
      return {
        gradient: 'from-blue-500 to-indigo-600',
        glow: 'shadow-blue-500/25 border-blue-500/20 text-blue-400',
        stroke: '#3b82f6'
      };
    } else if (nameLower.includes('java')) {
      return {
        gradient: 'from-red-500 to-orange-500',
        glow: 'shadow-red-500/25 border-red-500/20 text-red-400',
        stroke: '#ef4444'
      };
    } else if (nameLower.includes('javascript') || nameLower.includes('html') || nameLower.includes('css') || nameLower.includes('react') || nameLower.includes('typescript')) {
      return {
        gradient: 'from-yellow-400 via-amber-500 to-indigo-500',
        glow: 'shadow-amber-500/25 border-amber-500/20 text-amber-400',
        stroke: '#f59e0b'
      };
    } else if (nameLower.includes('c')) {
      return {
        gradient: 'from-purple-500 to-violet-600',
        glow: 'shadow-purple-500/25 border-purple-500/20 text-purple-400',
        stroke: '#a855f7'
      };
    }
    
    return {
      gradient: 'from-teal-400 to-cyan-500',
      glow: 'shadow-teal-500/25 border-teal-500/20 text-teal-400',
      stroke: '#2dd4bf'
    };
  };

  const config = getSkillConfig(skill.name);
  const radius = 24;
  const circumference = 2 * Math.PI * radius; // ~150.8
  const offset = circumference - (skill.level / 100) * circumference;

  return (
    <div className={`group relative p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] flex items-center justify-between`}>
      {/* Glow Effect */}
      <div className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-[0.03] blur-xl transition-opacity duration-300`}></div>
      
      <div className="space-y-1.5">
        <h4 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">{skill.name}</h4>
        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 ${config.glow}`}>
          {skill.level >= 85 ? 'Expert' : skill.level >= 75 ? 'Advanced' : 'Intermediate'}
        </span>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Underlay Circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-white/10"
            strokeWidth="3.5"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke={config.stroke}
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-xs font-bold text-gray-200">{skill.level}%</span>
      </div>
    </div>
  );
};

export default SkillBar;