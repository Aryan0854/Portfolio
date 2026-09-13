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
        <main className="flex-grow pt-24 sm:pt-28 pb-20 animate-fade-in">
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
