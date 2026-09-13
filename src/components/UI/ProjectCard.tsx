import React, { useState } from 'react';
import { Project } from '../../types';
import { ExternalLink, Github as GitHub, X, FileText, ArrowUpRight } from 'lucide-react';
import ImageLoader from './ImageLoader';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasLiveDemo = project.liveLink !== '#';

  const openModal = () => {
    if (!hasLiveDemo) setIsModalOpen(true);
  };

  return (
    <>
      <article
        className="group relative flex flex-col h-full bg-white/[0.03] backdrop-blur-md rounded-2xl overflow-hidden border border-white/[0.07] shadow-xl hover:border-indigo-400/30 hover:shadow-[0_16px_40px_rgba(99,102,241,0.12)] transition-all duration-300 hover:-translate-y-1.5"
        onClick={openModal}
      >
        <div className="relative aspect-[16/10] overflow-hidden shrink-0 bg-[#0c1018]">
          <ImageLoader
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top transform group-hover:scale-[1.04] transition-transform duration-700"
            lazy={false}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-transparent to-transparent opacity-80" />
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
          <div className="space-y-3">
            <h3 className="text-[17px] font-bold text-white group-hover:text-indigo-200 transition-colors leading-snug line-clamp-2 [overflow-wrap:anywhere] hyphens-none">
              {project.title}
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-200 rounded-md border border-indigo-500/15"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-white/5 text-slate-400 rounded-md border border-white/5">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>

            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-light">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold pt-3 border-t border-white/[0.06]" onClick={(e) => e.stopPropagation()}>
            {hasLiveDemo ? (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white transition-colors"
              >
                <ExternalLink size={13} /> Live Demo
              </a>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white transition-colors"
              >
                <ExternalLink size={13} /> View Details
              </button>
            )}

            {project.publicationLink && (
              <a
                href={project.publicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white transition-colors"
              >
                <FileText size={13} /> Publication
              </a>
            )}

            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors ml-auto"
            >
              <GitHub size={13} /> Code
            </a>
          </div>
        </div>
      </article>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[#11151f] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-4 pr-8 leading-snug">{project.title}</h2>

            <div className="mb-5 overflow-hidden rounded-xl border border-white/5 aspect-[16/10] bg-black/20">
              <ImageLoader
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top"
                lazy
              />
            </div>

            <p className="text-slate-300 text-sm leading-relaxed font-light mb-5">{project.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/10 text-indigo-200 rounded-md text-xs">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors"
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
      )}
    </>
  );
};

export default ProjectCard;
