import React from 'react';
import { profileData } from '../../data/profileData';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import SectionHeading from '../UI/SectionHeading';

const ExperienceSection: React.FC = () => {
  const { experiences, education } = profileData;

  return (
    <section className="py-16 sm:py-20 relative z-10">
      <SectionHeading
        eyebrow="Background"
        title="Journey &"
        highlight="History"
        subtitle="AI/ML internships, full-stack roles, and academic work at Presidency University, Bengaluru."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-7">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Briefcase size={18} />
            </span>
            Work Experience
          </h3>

          <div className="relative pl-6 border-l border-white/10 ml-4 space-y-5">
            {experiences.map((experience, index) => (
              <div key={index} className="relative group">
                <span className="absolute -left-[33px] top-7 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-[#07080d] group-hover:scale-125 transition-transform duration-300" />
                <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {experience.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-indigo-300 font-semibold shrink-0">
                      <Calendar size={12} />
                      <span>{experience.period}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">{experience.company}</p>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{experience.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20">
              <GraduationCap size={18} />
            </span>
            Education
          </h3>

          <div className="relative pl-6 border-l border-white/10 ml-4 space-y-5">
            {education.map((edu, index) => (
              <div key={index} className="relative group">
                <span className="absolute -left-[33px] top-7 w-3.5 h-3.5 rounded-full bg-violet-500 border-4 border-[#07080d] group-hover:scale-125 transition-transform duration-300" />
                <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">
                      {edu.degree}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-violet-300 font-semibold shrink-0">
                      <Calendar size={12} />
                      <span>{edu.period}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">{edu.institution}</p>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
