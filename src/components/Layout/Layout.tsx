import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Enhanced3DBackground from '../ThreeD/Enhanced3DBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Enhanced3DBackground />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Header />
        <main className="flex-grow pt-28 sm:pt-32 pb-20 animate-fade-in">
          <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
