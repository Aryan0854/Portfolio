import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Certificate } from '../../types';
import { ExternalLink, X, ArrowUpRight, Award } from 'lucide-react';
import ImageLoader from './ImageLoader';

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isModalOpen]);

  const modal =
    isModalOpen &&
    createPortal(
      <div
        className="fixed inset-0 z-[100] overflow-y-auto animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`certificate-modal-${certificate.id}`}
        onClick={closeModal}
      >
        <div className="flex min-h-full items-start justify-center bg-black/85 p-4 pb-10 pt-16 backdrop-blur-md sm:items-center sm:py-10">
          <div
            className="relative flex max-h-[min(88vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11151f] shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <h2
                id={`certificate-modal-${certificate.id}`}
                className="pr-2 text-xl font-bold leading-snug text-white"
              >
                {certificate.title}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="shrink-0 rounded-full bg-white/5 p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              <div className="mb-5 flex items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-black/20 p-2">
                <ImageLoader
                  src={certificate.image}
                  alt={certificate.title}
                  className="h-auto max-h-[50vh] w-full rounded-lg object-contain"
                  lazy
                  priority={false}
                />
              </div>

              <div className="flex flex-col justify-between gap-4 border-t border-white/5 pt-4 sm:flex-row sm:items-center">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-200">
                    <span className="font-normal text-slate-400">Issued by:</span> {certificate.issuer}
                  </p>
                  <p className="text-xs text-slate-400">
                    <span>Issue Date:</span> {certificate.date}
                  </p>
                </div>

                {certificate.link && certificate.link !== 'None' && certificate.link !== '' && (
                  <a
                    href={certificate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
                  >
                    Verify Credentials <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11151f] shadow-xl transition-all duration-300 hover:border-indigo-400/35 hover:shadow-[0_16px_40px_rgba(99,102,241,0.12)] md:hover:-translate-y-1.5"
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
        aria-label={`View certificate: ${certificate.title}`}
      >
        <div className="relative h-44 shrink-0 overflow-hidden">
          <ImageLoader
            src={certificate.image}
            alt={certificate.title}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            lazy
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080710] via-black/40 to-transparent" />
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white opacity-80 backdrop-blur-md transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="flex flex-grow flex-col justify-between space-y-3 p-5">
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-indigo-200">
              {certificate.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Award size={13} className="shrink-0 text-indigo-400" />
              <span className="truncate">{certificate.issuer}</span>
              <span className="text-white/20">•</span>
              <span className="shrink-0">{certificate.date.split(' ').pop()}</span>
            </div>
          </div>

          <div className="flex justify-end border-t border-white/5 pt-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1 text-indigo-400 group-hover:underline">
              Verify Credentials <ExternalLink size={12} />
            </span>
          </div>
        </div>
      </div>

      {modal}
    </>
  );
};

export default CertificateCard;
