import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bot, Sparkles } from 'lucide-react';

export default function DeveloperAvatar({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const particles = Array.from({ length: 42 }, (_, index) => ({
      angle: (index / 42) * Math.PI * 2,
      radius: 0.22 + Math.random() * 0.34,
      speed: 0.00018 + Math.random() * 0.00028,
      size: 1.2 + Math.random() * 2.2,
      drift: Math.random() * Math.PI * 2,
    }));
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(bounds.width, 280);
      height = Math.max(bounds.height, 380);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height);
      const positions = particles.map((particle) => {
        const angle = particle.angle + time * particle.speed;
        const radius = (particle.radius + Math.sin(time * 0.001 + particle.drift) * 0.012) * scale;
        return {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius * 0.82,
        };
      });

      positions.forEach((point, index) => {
        positions.slice(index + 1).forEach((other) => {
          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < scale * 0.16) {
            context.strokeStyle = `rgba(159, 199, 125, ${Math.max(0, 0.18 - distance / scale)})`;
            context.lineWidth = 0.7;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        });
        context.fillStyle = 'rgba(196, 222, 163, .78)';
        context.beginPath();
        context.arc(point.x, point.y, particles[index].size, 0, Math.PI * 2);
        context.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--avatar-rotate-x', `${y * -5}deg`);
    event.currentTarget.style.setProperty('--avatar-rotate-y', `${x * 7}deg`);
    event.currentTarget.style.setProperty('--avatar-shift-x', `${x * 8}px`);
    event.currentTarget.style.setProperty('--avatar-shift-y', `${y * 6}px`);
  };

  const resetPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--avatar-rotate-x', '0deg');
    event.currentTarget.style.setProperty('--avatar-rotate-y', '0deg');
    event.currentTarget.style.setProperty('--avatar-shift-x', '0px');
    event.currentTarget.style.setProperty('--avatar-shift-y', '0px');
  };

  const handleActivate = () => {
    setIsActive(true);
    window.setTimeout(() => setIsActive(false), 1900);
  };

  return (
    <div
      ref={containerRef}
      className={`developer-avatar${isActive ? ' is-active' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="Interactive abstract developer avatar"
    >
      <canvas ref={canvasRef} className="developer-avatar-particles" aria-hidden="true" />
      <div className="developer-avatar-glow" aria-hidden="true" />
      <div className="developer-avatar-orbit developer-avatar-orbit--one" aria-hidden="true" />
      <div className="developer-avatar-orbit developer-avatar-orbit--two" aria-hidden="true" />

      <button type="button" className="developer-avatar-figure" onClick={handleActivate} aria-label="Activate Mubashir developer avatar">
        <span className="developer-avatar-halo" aria-hidden="true" />
        <span className="developer-avatar-head"><span>MA</span><i /></span>
        <span className="developer-avatar-neck" aria-hidden="true" />
        <span className="developer-avatar-body">
          <span className="developer-avatar-collar" aria-hidden="true" />
          <span className="developer-avatar-chip"><Bot size={16} /><b>AI</b></span>
          <span className="developer-avatar-code">&lt;/&gt;</span>
        </span>
        <span className="developer-avatar-base" aria-hidden="true" />
        <span className="developer-avatar-spark developer-avatar-spark--one">✦</span>
        <span className="developer-avatar-spark developer-avatar-spark--two">·</span>
      </button>

      <div className="developer-avatar-label"><Sparkles size={13} /><span>AI · IOT · BUILDING</span></div>
      <button type="button" className="developer-avatar-action" onClick={onOpenAssistant}>
        <span>Ask my AI assistant</span><ArrowUpRight size={14} />
      </button>
      <span className="developer-avatar-caption">Mubashir Ahmed · developer in progress</span>
    </div>
  );
}
