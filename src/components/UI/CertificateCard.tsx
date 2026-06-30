import React, { useState } from 'react';
import { Certificate } from '../../types';
import { ExternalLink, X, ArrowUpRight, Award } from 'lucide-react';
import ImageLoader from './ImageLoader';

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <div 
        className="group relative flex flex-col bg-[#11151f]/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 shadow-xl hover:border-[#6366f1]/30 hover:shadow-[0_10px_35px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
        onClick={openModal}
      >
        {/* Certificate Image Frame */}
        <div className="relative h-44 overflow-hidden shrink-0">
          <ImageLoader 
            src={certificate.image} 
            alt={certificate.title} 
            className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
            lazy={true}
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080710] via-black/40 to-transparent"></div>
          
          {/* Action indicators */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight size={14} />
          </div>
        </div>
        
        {/* Content Details */}
        <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-1">{certificate.title}</h3>
            
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Award size={13} className="text-indigo-400 shrink-0" />
              <span className="truncate">{certificate.issuer}</span>
              <span className="text-white/10">•</span>
              <span className="shrink-0">{certificate.date.split(' ').pop()}</span>
            </div>
          </div>
          
          <div className="flex justify-end text-xs font-semibold pt-2 border-t border-white/5">
            <span className="text-indigo-400 group-hover:underline inline-flex items-center gap-1">
              Verify Credentials <ExternalLink size={12} />
            </span>
          </div>
        </div>
      </div>
      
      {/* Detailed view Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" onClick={closeModal}>
          <div className="bg-[#11151f] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-scale-in" onClick={e => e.stopPropagation()}>
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-4 pr-8">{certificate.title}</h2>
            
            <div className="mb-5 overflow-hidden rounded-xl border border-white/5 flex items-center justify-center bg-black/20 p-2">
              <ImageLoader 
                src={certificate.image} 
                alt={certificate.title} 
                className="w-full h-auto rounded-lg object-contain max-h-[50vh]"
                lazy={true}
                priority={false}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="space-y-0.5">
                <p className="text-sm text-gray-300 font-semibold"><span className="text-gray-400 font-light">Issued by:</span> {certificate.issuer}</p>
                <p className="text-xs text-gray-400"><span className="font-light">Issue Date:</span> {certificate.date}</p>
              </div>
              
              {certificate.link && certificate.link !== 'None' && certificate.link !== '' && (
                <a 
                  href={certificate.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors shrink-0"
                >
                  Verify Credentials <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateCard;