'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ThemeConfig } from '@/lib/types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  depth: number;
  opacity: number;
}

export default function ParticleEngine({ theme }: { theme: ThemeConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, pressed: false, clickX: -1000, clickY: -1000, clickTime: 0 });
  const animRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(150, Math.floor((width * height) / 8000));
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const depth = 0.3 + Math.random() * 0.7;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5 * depth,
        vy: (Math.random() - 0.5) * 0.5 * depth,
        size: (1 + Math.random() * 2.5) * depth,
        color: theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)] || '#666',
        depth,
        opacity: 0.2 + depth * 0.6,
      });
    }
    particlesRef.current = particles;
  }, [theme.particleColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Update particle colors when theme changes
    particlesRef.current.forEach(p => {
      p.color = theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)] || '#666';
    });

    const handleMove = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    const handleDown = (e: MouseEvent) => {
      mouseRef.current.pressed = true;
      mouseRef.current.clickX = e.clientX;
      mouseRef.current.clickY = e.clientY;
      mouseRef.current.clickTime = Date.now();
    };
    const handleUp = () => { mouseRef.current.pressed = false; };
    const handleLeave = () => { mouseRef.current.x = -1000; mouseRef.current.y = -1000; mouseRef.current.pressed = false; };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('mouseleave', handleLeave);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const clickAge = Date.now() - mouse.clickTime;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = ((120 - dist) / 120) * 2 * p.depth;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Click explosion
        if (clickAge < 600) {
          const cdx = p.x - mouse.clickX;
          const cdy = p.y - mouse.clickY;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 200 && cdist > 0) {
            const strength = ((200 - cdist) / 200) * (1 - clickAge / 600) * 8;
            p.vx += (cdx / cdist) * strength;
            p.vy += (cdy / cdist) * strength;
          }
        }

        // Gravitational hold
        if (mouse.pressed) {
          const gdx = mouse.x - p.x;
          const gdy = mouse.y - p.y;
          const gd = Math.sqrt(gdx * gdx + gdy * gdy);
          if (gd > 0 && gd < 300) {
            const gForce = 0.3 * p.depth;
            p.vx += (gdx / gd) * gForce;
            p.vy += (gdy / gd) * gForce;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }

      // Dynamic linking lines
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const ldx = a.x - b.x;
          const ldy = a.y - b.y;
          const ld = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ld < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = (1 - ld / 100) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [theme, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-auto"
      style={{ pointerEvents: 'auto' }}
    />
  );
}