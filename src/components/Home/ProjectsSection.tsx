import React from 'react';
import { Link } from 'react-router-dom';
import { profileData } from '../../data/profileData';
import ProjectCard from '../UI/ProjectCard';
import { ArrowRight } from 'lucide-react';

const ProjectsSection: React.FC = () => {
  const featuredProjects = profileData.projects.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
        <div className="space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
            Selected work
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Projects</span>
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
