import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ParticleBackground from '../ThreeD/ParticleBackground';

interface LayoutProps {
  children: React.ReactNode;
  hideParticles?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideParticles = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-black">
      {!hideParticles && <ParticleBackground />}
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;