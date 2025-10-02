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
      <div className="container mx-auto px-4 py-12 relative z-20">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          My <span className="text-indigo-500">Certificates</span>
        </h1>
        
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCertificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
        
        {filteredCertificates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No certificates found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CertificatesPage;