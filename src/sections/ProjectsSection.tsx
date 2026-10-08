import { useMemo, useState } from 'react';
import { Layers3 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { projectPlaceholders } from '../../shared/profileData.js';

const filters = ['All', 'AI/ML', 'Full Stack', 'Academic', 'Experiments'];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filteredProjects = useMemo(() => activeFilter === 'All'
    ? projectPlaceholders
    : projectPlaceholders.filter((project) => project.categories.includes(activeFilter)), [activeFilter]);

  return (
    <section className="projects-section page-section" id="projects" aria-labelledby="projects-title">
      <div className="page-container section-layout">
        <SectionHeading number="03" eyebrow="SELECTED WORK" title="Things I’ve built." description="A concise look at the problems I keep returning to: useful AI tools, clear workflows, automation, and software that helps people get something done." />
        <div className="projects-content">
          <div className="projects-heading-row">
            <p className="projects-context">Some are finished experiments, some are learning projects, and one is still growing. Together they show how I move from curiosity to a working prototype.</p>
          </div>
          <div className="filter-bar" role="group" aria-label="Filter projects by category">
            <span className="filter-label"><Layers3 size={14} /> FILTER</span>
            {filters.map((filter) => <button className={`filter-button ${activeFilter === filter ? 'is-active' : ''}`} type="button" aria-pressed={activeFilter === filter} key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
          </div>
          <div className="projects-grid" aria-live="polite">
            {filteredProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
