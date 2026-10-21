import React from 'react';
import { Link } from 'react-router-dom';
import { profileData } from '../../data/profileData';
import ProjectCard from '../UI/ProjectCard';
import { ArrowRight } from 'lucide-react';

const ProjectsSection: React.FC = () => {
  const featuredProjects = profileData.projects.slice(0, 3);

  return (
    <section className="relative z-10 py-12 sm:py-20">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end sm:gap-5">
        <div className="space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
            Selected work
          </span>
          <h2 className="text-[1.7rem] font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">AI &amp; Full-Stack Projects</span>
          </h2>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-white transition-colors"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
