import React, { useState } from 'react';
import { Certificate } from '../../types';
import { ExternalLink, X } from 'lucide-react';
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
        className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        onClick={openModal}
      >
        <div className="relative h-48 overflow-hidden">
          <ImageLoader 
            src={certificate.image} 
            alt={certificate.title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{certificate.title}</h3>
          <p className="text-gray-400 text-sm mb-2">
            {certificate.issuer} • {certificate.date}
          </p>
          <div className="flex justify-end">
            <button 
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
            >
              View Details <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal for certificate details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full p-6 shadow-2xl relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-4">{certificate.title}</h2>
            
            <div className="mb-6">
              <ImageLoader 
                src={certificate.image} 
                alt={certificate.title} 
                className="w-full h-auto rounded-lg object-contain max-h-[60vh]"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-gray-300"><span className="text-gray-400">Issued by:</span> {certificate.issuer}</p>
                <p className="text-gray-300"><span className="text-gray-400">Date:</span> {certificate.date}</p>
              </div>
              
              <a 
                href={certificate.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                View Certificate <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateCard;