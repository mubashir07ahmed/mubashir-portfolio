import { Code2 } from 'lucide-react';

type Project = {
  title: string;
  description: string;
  categories: string[];
  technologies: string[];
  githubUrl: string;
  liveDemoUrl: string;
  previewImage: string;
  placeholder: boolean;
};

function safePreviewUrl(value: string) {
  if (!value) return '';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''; } catch { return ''; }
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const preview = safePreviewUrl(project.previewImage);
  return (
    <article className="project-card glass-card">
      <div className="project-visual">
        {preview && <img className="project-preview-image" src={preview} alt={`${project.title} preview`} loading="lazy" />}
        <div className={`project-orbit project-orbit--${index + 1}`} aria-hidden="true"><span /><span /><span /></div>
        <div className="project-visual-label"><Code2 size={17} /><span>PROJECT / {String(index + 1).padStart(2, '0')}</span></div>
      </div>
      <div className="project-card-body">
        <div className="project-category-row">{project.categories.map((category) => <span className="micro-tag" key={category}>{category}</span>)}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tech-chip-row">{project.technologies.map((technology) => <span className="tech-chip" key={technology}>{technology}</span>)}</div>
      </div>
    </article>
  );
}
