import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { profileData } from '../data/profileData';
import CertificateCard from '../components/UI/CertificateCard';
import { Search } from 'lucide-react';
import SectionHeading from '../components/UI/SectionHeading';
import SEOHead from '../components/SEO/SEOHead';
import { pagesSeo } from '../config/site';

const CertificatesPage: React.FC = () => {
  const { certificates } = profileData;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <SEOHead {...pagesSeo.certificates} />
      <div className="relative z-20 w-full space-y-10 py-6">
        <SectionHeading
          index="03"
          eyebrow="Credentials"
          title="Certificates &"
          highlight="Internships"
          subtitle="Google, Oracle, Databricks, Azure, and AI/ML internship credentials earned by Aryan Mishra."
        />

        <div className="max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search by title, issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-[var(--line)] bg-[var(--bg-elevated)] py-3.5 pl-11 pr-4 text-sm text-[var(--fg)] placeholder-[var(--muted)] outline-none transition-colors focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCertificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="mx-auto max-w-md space-y-2 border border-dashed border-[var(--line)] py-16 text-center">
            <p className="text-sm font-medium text-[var(--fg)]">No certificates found</p>
            <p className="text-xs text-[var(--muted)]">Try another issuer or name.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CertificatesPage;
