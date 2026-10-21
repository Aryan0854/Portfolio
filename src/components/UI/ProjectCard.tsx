import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '../../types';
import { ExternalLink, Github as GitHub, X, FileText, ArrowUpRight, Lock } from 'lucide-react';
import ImageLoader from './ImageLoader';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrivateNotice, setShowPrivateNotice] = useState(false);
  const hasLiveDemo = project.liveLink !== '#' && Boolean(project.liveLink);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closePrivateNotice = () => setShowPrivateNotice(false);

  useEffect(() => {
    if (!isModalOpen && !showPrivateNotice) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (showPrivateNotice) closePrivateNotice();
      else closeModal();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isModalOpen, showPrivateNotice]);

  const detailsModal =
    isModalOpen &&
    createPortal(
      <div
        className="fixed inset-0 z-[100] overflow-y-auto animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-${project.id}`}
        onClick={closeModal}
      >
        <div className="flex min-h-full items-start justify-center bg-black/80 p-4 pb-10 pt-16 backdrop-blur-md sm:items-center sm:py-10">
          <div
            className="relative flex max-h-[min(88vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11151f] shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <h2
                id={`project-modal-${project.id}`}
                className="pr-2 text-xl font-bold leading-snug text-white sm:text-2xl"
              >
                {project.title}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="shrink-0 rounded-full bg-white/5 p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              <div className="mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-white/5 bg-black/20">
                <ImageLoader
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover object-top"
                  lazy
                />
              </div>

              <p className="mb-5 text-sm leading-relaxed text-slate-200">{project.description}</p>

              <div className="mb-6 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-indigo-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {hasLiveDemo && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                {project.codePrivate ? (
                  <button
                    type="button"
                    onClick={() => setShowPrivateNotice(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-white/20"
                  >
                    <Lock size={14} /> Code access
                  </button>
                ) : (
                  project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition-colors ${
                        hasLiveDemo
                          ? 'border border-white/10 hover:border-white/20'
                          : 'bg-indigo-600 hover:bg-indigo-500'
                      }`}
                    >
                      <GitHub size={14} /> Get Codebase
                    </a>
                  )
                )}
                {project.publicationLink && (
                  <a
                    href={project.publicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-white/20"
                  >
                    <FileText size={14} /> View Paper
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  const privateModal =
    showPrivateNotice &&
    createPortal(
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in"
        onClick={closePrivateNotice}
      >
        <div
          className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#11151f] p-6 shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="private-repo-title"
        >
          <button
            type="button"
            onClick={closePrivateNotice}
            className="absolute right-4 top-4 rounded-full bg-white/5 p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
            <Lock size={18} />
          </div>
          <h2 id="private-repo-title" className="pr-8 text-xl font-bold text-white">
            Private repository
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">
            This repository is private. The code is company property and is not available to share.
          </p>
          <button
            type="button"
            onClick={closePrivateNotice}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Got it
          </button>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <article
        className="turn-card group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11151f] shadow-xl transition-all duration-300 hover:border-indigo-400/35 hover:shadow-[0_18px_44px_rgba(99,102,241,0.16)]"
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
        aria-label={`View details for ${project.title}`}
      >
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[#0c1018]">
          <ImageLoader
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            lazy={false}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-transparent to-transparent opacity-80" />
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-80 backdrop-blur-md transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="flex flex-grow flex-col justify-between gap-4 p-5 sm:p-6">
          <div className="space-y-3">
            <h3 className="line-clamp-2 text-[17px] font-bold leading-snug text-white transition-colors [overflow-wrap:anywhere] hyphens-none group-hover:text-indigo-200">
              {project.title}
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-indigo-400/25 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-100"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>

            <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">{project.description}</p>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-3 text-xs font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center gap-1 text-indigo-300 transition-colors hover:text-white"
            >
              <ExternalLink size={13} /> View Details
            </button>

            {hasLiveDemo && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-300 transition-colors hover:text-white"
              >
                <ExternalLink size={13} /> Live Demo
              </a>
            )}

            {project.publicationLink && (
              <a
                href={project.publicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-300 transition-colors hover:text-white"
              >
                <FileText size={13} /> Publication
              </a>
            )}

            {project.codePrivate ? (
              <button
                type="button"
                onClick={() => setShowPrivateNotice(true)}
                className="ml-auto inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
              >
                <Lock size={13} /> Code
              </button>
            ) : (
              project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
                >
                  <GitHub size={13} /> Code
                </a>
              )
            )}
          </div>
        </div>
      </article>

      {detailsModal}
      {privateModal}
    </>
  );
};

export default ProjectCard;
