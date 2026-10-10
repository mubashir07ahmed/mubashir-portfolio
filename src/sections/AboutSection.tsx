import { BrainCircuit, Code2, GraduationCap, MoveUpRight, Sparkles } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const highlights = [
  { icon: BrainCircuit, title: 'AI & Machine Learning', copy: 'Learning how intelligent systems become useful products, not just demos.' },
  { icon: Code2, title: 'Full-Stack Development', copy: 'Connecting thoughtful interfaces with APIs, databases, and practical workflows.' },
  { icon: GraduationCap, title: 'Data Structures & Algorithms', copy: 'Strengthening the foundations that make better problem solving possible.' },
  { icon: Sparkles, title: 'Continuous Learning', copy: 'Turning coursework, experiments, and feedback into steady progress.' },
];

export default function AboutSection() {
  return (
    <section className="about-section page-section" id="about" aria-labelledby="about-title">
      <div className="page-container section-layout">
        <SectionHeading number="01" eyebrow="A LITTLE ABOUT ME" title="Curiosity, made practical." description="I’m interested in what happens behind the interface—and in making that hidden work useful to real people." />
        <div className="about-content">
          <div className="about-copy">
            <p className="lead-copy">I’m <strong>Mubashir Ahmed</strong>, a 2nd-year B.Tech Internet of Things student at VNR VJIET. I’m curious about how software, intelligent systems, and connected devices can work together to solve everyday problems.</p>
            <p>I learn best by building. My projects have taken me through chatbots, question-solving tools, PDF automation, task management, and a campus lost-and-found idea. Each one helps me understand a little more about turning a rough idea into a usable flow.</p>
            <p>My current toolkit includes C, Java, Python, HTML, CSS, JavaScript, AI APIs, chatbot development, full-stack development, and MySQL. I also make time for data structures, algorithms, object-oriented programming, and the fundamentals that support good engineering decisions.</p>
            <p>My direction is simple: keep improving as an AI/ML, full-stack, and IoT developer while building work that is clear, useful, and honest about what I’m still learning.</p>
            <a className="text-link about-link" href="#journey">Follow my learning journey <MoveUpRight size={15} /></a>
          </div>
          <div className="highlight-grid">
            {highlights.map(({ icon: Icon, title, copy }, index) => <article className="highlight-card glass-card" key={title}>
              <span className="highlight-index">0{index + 1}</span>
              <span className="highlight-icon"><Icon size={19} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>)}
          </div>
        </div>
      </div>
    </section>
  );
}
