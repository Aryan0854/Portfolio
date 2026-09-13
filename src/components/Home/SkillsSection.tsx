import React from 'react';
import { profileData } from '../../data/profileData';
import SkillBar from '../UI/SkillBar';
import SectionHeading from '../UI/SectionHeading';

const SkillsSection: React.FC = () => {
  const { skills } = profileData;

  return (
    <section className="py-16 sm:py-20 relative z-10">
      <SectionHeading
        eyebrow="Capabilities"
        title="Technical"
        highlight="Skills"
        subtitle="Machine learning, full-stack development, and automation pipelines I use to ship production work."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill, index) => (
          <SkillBar key={index} skill={skill} />
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
