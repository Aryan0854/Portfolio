import React, { useState } from 'react';
import { Project } from '../../types';
import { ExternalLink, Github as GitHub, X } from 'lucide-react';
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
        className="group bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2"
      >
        <div className="relative h-48 overflow-hidden">
          <ImageLoader 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-1 bg-indigo-900/60 text-blue-200 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
          
          <div className="flex justify-between items-center">
            {project.liveLink !== '#' ? (
              <a 
                href={project.liveLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            ) : (
              <button 
                onClick={openModal}
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink size={16} /> View Details
              </button>
            )}
            
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <GitHub size={16} /> Code
            </a>
          </div>
        </div>
      </div>
      
      {/* Modal for projects without live demo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-4">{project.title}</h2>
            
            <div className="mb-6">
              <ImageLoader 
                src={project.image} 
                alt={project.title} 
                className="w-full h-auto rounded-lg"
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{project.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-indigo-900/60 text-blue-200 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <p className="text-yellow-300 mb-2">Live demo can't be shown</p>
              <p className="text-gray-300 mb-4">To view this project, download the repository and follow the directions from README.</p>
              
              <a 
                href={project.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <GitHub size={18} /> Download Repository
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;