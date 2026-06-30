import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Enhanced3DBackground from '../ThreeD/Enhanced3DBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Enhanced3DBackground />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Header />
        <main className="flex-grow pt-28 pb-16 sm:pb-8 animate-scale-in">
          <div className="w-full px-4 sm:px-6 lg:px-8 md:px-12 lg:px-16">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;