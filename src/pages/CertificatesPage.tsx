import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { profileData } from '../data/profileData';
import CertificateCard from '../components/UI/CertificateCard';
import Certificates3DEffects from '../components/ThreeD/Certificates3DEffects';
import { Search } from 'lucide-react';

const CertificatesPage: React.FC = () => {
  const { certificates } = profileData;
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCertificates = certificates.filter(cert => 
    cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Layout>
      <Certificates3DEffects />
      <div className="w-full py-8 relative z-20 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            My <span className="text-[#6366f1] text-glow-indigo">Certificates</span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] mx-auto rounded-full"></div>
          <p className="text-gray-400 text-xs sm:text-sm">
            Professional development records, including internships, cloud associateships, and technical certification courses.
          </p>
        </div>
        
        {/* Sleek Search Control */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
            />
          </div>
        </div>
        
        {/* Certificate Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
          {filteredCertificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredCertificates.length === 0 && (
          <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl max-w-md mx-auto space-y-2">
            <p className="text-gray-300 font-semibold text-sm">No Certificates Found</p>
            <p className="text-gray-500 text-xs font-light">Try searching for another issuer or certificate name.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CertificatesPage;