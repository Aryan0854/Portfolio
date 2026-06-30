import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { profileData } from '../data/profileData';
import ProjectCard from '../components/UI/ProjectCard';
import Projects3DEffects from '../components/ThreeD/Projects3DEffects';
import { Search } from 'lucide-react';

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
      <Projects3DEffects />
      <div className="w-full py-8 relative z-20 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            My <span className="text-[#6366f1] text-glow-indigo">Projects</span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] mx-auto rounded-full"></div>
          <p className="text-gray-400 text-xs sm:text-sm">
            Search or filter through {projects.length} academic publications, IoT devices, ML simulation dashboards, and full-stack applications.
          </p>
        </div>
        
        {/* Sleek Search Panel */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
            />
          </div>
        </div>
        
        {/* Responsive Horizontal scroll filter chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 ${
              selectedTechnology === '' 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
            onClick={() => setSelectedTechnology('')}
          >
            All Projects
          </button>
          
          {allTechnologies.map((tech) => (
            <button
              key={tech}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 ${
                selectedTechnology === tech 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
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