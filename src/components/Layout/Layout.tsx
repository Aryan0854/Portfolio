import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Simple3DBackground from '../ThreeD/Simple3DBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Simple3DBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20 pb-16 sm:pb-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;