import React from 'react';
import { Link } from 'react-router-dom';
import { profileData } from '../../data/profileData';
import ProjectCard from '../UI/ProjectCard';
import { ArrowRight } from 'lucide-react';

const ProjectsSection: React.FC = () => {
  // Get only the first 3 projects for the home page
  const featuredProjects = profileData.projects.slice(0, 3);
  
  return (
    <div className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            Featured <span className="text-indigo-500">Projects</span>
          </h2>
          
          <Link
            to="/projects"
            className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;