import React from 'react';
import Layout from '../components/Layout/Layout';
import HeroSection from '../components/Home/HeroSection';
import SkillsSection from '../components/Home/SkillsSection';
import ProjectsSection from '../components/Home/ProjectsSection';
import ExperienceSection from '../components/Home/ExperienceSection';
import SEOHead from '../components/SEO/SEOHead';
import { pagesSeo } from '../config/site';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <SEOHead {...pagesSeo.home} />
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
    </Layout>
  );
};

export default HomePage;