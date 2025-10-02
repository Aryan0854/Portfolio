import React from 'react';
import Layout from '../components/Layout/Layout';
import HeroSection from '../components/Home/HeroSection';
import SkillsSection from '../components/Home/SkillsSection';
import ProjectsSection from '../components/Home/ProjectsSection';
import ExperienceSection from '../components/Home/ExperienceSection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
    </Layout>
  );
};

export default HomePage;