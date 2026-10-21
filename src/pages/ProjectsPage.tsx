import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { profileData } from '../data/profileData';
import ProjectCard from '../components/UI/ProjectCard';
import Projects3DEffects from '../components/ThreeD/Projects3DEffects';
import { Search } from 'lucide-react';
import SectionHeading from '../components/UI/SectionHeading';
import SEOHead from '../components/SEO/SEOHead';
import { pagesSeo } from '../config/site';

const ProjectsPage: React.FC = () => {
  const { projects } = profileData;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('');
  
  // Extract all unique technologies
  const allTechnologies = Array.from(
    new Set(
      projects.flatMap(project => project.technologies)
    )
  ).sort();
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTechnology = 
      selectedTechnology === '' || 
      project.technologies.includes(selectedTechnology);
    
    return matchesSearch && matchesTechnology;
  });
  
  // Reset selected technology when search query changes
  useEffect(() => {
    setSelectedTechnology('');
  }, [searchQuery]);
  
  return (
    <Layout>
      <SEOHead {...pagesSeo.projects} />
      <Projects3DEffects />
      <div className="w-full py-6 relative z-20 space-y-10">
        <SectionHeading
          eyebrow="Build log"
          title="AI, ML & Full-Stack"
          highlight="Projects"
          subtitle={`Search or filter ${projects.length} machine learning, IoT, RAG, and full-stack apps by Aryan Mishra.`}
        />
        
        {/* Sleek Search Panel */}
        <div className="max-w-xl">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#11151f] py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all duration-300 hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
        
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          <button
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 md:py-1.5 ${
              selectedTechnology === ''
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                : 'border-white/15 bg-[#11151f] text-slate-300 hover:border-white/25 hover:text-white'
            }`}
            onClick={() => setSelectedTechnology('')}
          >
            All Projects
          </button>

          {allTechnologies.map((tech) => (
            <button
              key={tech}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 md:py-1.5 ${
                selectedTechnology === tech
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                  : 'border-white/15 bg-[#11151f] text-slate-300 hover:border-white/25 hover:text-white'
              }`}
              onClick={() => setSelectedTechnology(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl max-w-md mx-auto space-y-2">
            <p className="text-gray-300 font-semibold text-sm">No Projects Found</p>
            <p className="text-gray-500 text-xs font-light">Try adjusting your filters or search query term.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectsPage;