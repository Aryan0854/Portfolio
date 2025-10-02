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
      <div className="container mx-auto px-4 py-12 relative z-20">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          My <span className="text-indigo-500">Projects</span>
        </h1>
        
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTechnology === '' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedTechnology('')}
          >
            All
          </button>
          
          {allTechnologies.map((tech) => (
            <button
              key={tech}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTechnology === tech 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedTechnology(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No projects found matching your criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectsPage;