import React, { useState } from 'react';
import { Project } from '../../types';
import { ExternalLink, Github as GitHub, X, FileText, ArrowUpRight } from 'lucide-react';
import ImageLoader from './ImageLoader';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    if (project.liveLink === '#') {
      setIsModalOpen(true);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <div 
        className="group relative flex flex-col h-full bg-[#11151f]/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 shadow-xl hover:border-[#6366f1]/30 hover:shadow-[0_10px_35px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer"
        onClick={openModal}
      >
        {/* Card Header Media */}
        <div className="relative h-48 sm:h-52 overflow-hidden shrink-0">
          <ImageLoader 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            lazy={false}
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080710] via-black/40 to-transparent"></div>
          
          {/* Action indicator */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight size={16} />
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-1">{project.title}</h3>
            
            {/* Tech tag list */}
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <span 
                  key={index} 
                  className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#6366f1]/10 text-indigo-300 rounded border border-[#6366f1]/15"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-white/5 text-gray-400 rounded border border-white/5">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">{project.description}</p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2 border-t border-white/5" onClick={e => e.stopPropagation()}>
            {project.liveLink !== '#' ? (
              <a 
                href={project.liveLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            ) : (
              <button 
                onClick={openModal}
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
              >
                <ExternalLink size={14} /> View Details
              </button>
            )}

            {project.publicationLink && (
              <a 
                href={project.publicationLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
              >
                <FileText size={14} /> Publication
              </a>
            )}
            
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline transition-all ml-auto"
            >
              <GitHub size={14} /> Code
            </a>
          </div>
        </div>
      </div>
      
      {/* Modal for detailed view */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#11151f] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-scale-in">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-4 pr-8">{project.title}</h2>
            
            <div className="mb-5 overflow-hidden rounded-xl border border-white/5 h-64 sm:h-72">
              <ImageLoader 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover object-center"
                lazy={true}
                priority={false}
              />
            </div>
            
            <div className="mb-5 space-y-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Description</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-light">{project.description}</p>
            </div>
            
            <div className="mb-6 space-y-2.5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Technologies Used</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-indigo-300 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-[#6366f1]/5 rounded-xl p-4 border border-[#6366f1]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-yellow-400 text-sm font-semibold mb-0.5">Offline Repository / Codebase</p>
                <p className="text-gray-400 text-xs font-light">To inspect or run, clone the repository via GitHub.</p>
              </div>
              
              <div className="flex flex-wrap gap-2 shrink-0">
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  <GitHub size={14} /> Get Codebase
                </a>
                {project.publicationLink && (
                  <a 
                    href={project.publicationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    <FileText size={14} /> View Paper
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;