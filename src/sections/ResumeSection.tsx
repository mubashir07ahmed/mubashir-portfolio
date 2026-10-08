import { ArrowUpRight, Download, Eye, FileText } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { profileData } from '../../shared/profileData.js';

export default function ResumeSection() {
  return (
    <section className="resume-section page-section" id="resume" aria-labelledby="resume-title">
      <div className="page-container section-layout">
        <SectionHeading number="06" eyebrow="THE NEXT PAGE" title="A closer look." description="View or download Mubashir’s resume for a concise overview of his education, skills, projects, achievements, and profile links." />
        <div className="resume-panel glass-card">
          <div className="resume-document" aria-hidden="true"><div className="resume-document-page"><span /><span /><span /><i /><span /><span /><span /></div><span className="resume-file-icon"><FileText size={25} /></span></div>
          <div className="resume-copy"><p className="eyebrow">RESUME · PDF · A4</p><h3>Mubashir Ahmed</h3><p>B.Tech Internet of Things (IoT) student focused on AI/ML, full-stack development, chatbot systems, and problem solving.</p></div>
          <div className="resume-actions"><a className="button button--primary" href={profileData.resumePath} target="_blank" rel="noreferrer"><Eye size={16} /> View resume <ArrowUpRight size={14} /></a><a className="button button--outline" href={profileData.resumePath} download><Download size={16} /> Download PDF</a></div>
        </div>
      </div>
    </section>
  );
}
