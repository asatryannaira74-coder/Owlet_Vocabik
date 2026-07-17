import React, { useMemo } from 'react';
import './_glowing-portals.css';
import { Lock } from 'lucide-react';

const grades = [
  { id: 3, color: '#FBBF24', emoji: '🌍', active: false },
  { id: 4, color: '#C084FC', emoji: '✏️', active: false },
  { id: 5, color: '#22C55E', emoji: '🏗️', active: true },
  { id: 6, color: '#38BDF8', emoji: '🎨', active: false },
  { id: 7, color: '#A78BFA', emoji: '📊', active: false },
  { id: 8, color: '#FB923C', emoji: '📐', active: false },
  { id: 9, color: '#F87171', emoji: '🎓', active: false },
];

const Particles = ({ color }: { color: string }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 2 + Math.random() * 2;
      const tx1 = (Math.random() - 0.5) * 40;
      const tx2 = (Math.random() - 0.5) * 80;
      
      return (
        <div
          key={i}
          className="particle"
          style={{
            left: `${left}%`,
            color,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            '--tx1': `${tx1}px`,
            '--tx2': `${tx2}px`,
          } as React.CSSProperties}
        />
      );
    });
  }, [color]);

  return <div className="particles">{particles}</div>;
};

export function GlowingPortals() {
  return (
    <div className="relative w-full h-screen min-h-[1080px] bg-[#1a1a2e] overflow-hidden flex items-center justify-center font-cinzel">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/__mockup/images/hero.png)',
          backgroundPosition: 'center',
          filter: 'brightness(0.6) contrast(1.2)'
        }}
      />
      
      {/* Ambient Overlay for mystery */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-[#0a0a1a] opacity-80" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#00000080] to-[#000000e6]" />

      {/* Portals Container */}
      <div className="relative z-10 w-full max-w-[1200px] h-[800px] mx-auto mt-20">
        <h1 className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fcf6ba] to-[#b38728] tracking-widest uppercase drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
          Select Your Realm
        </h1>

        <div className="absolute inset-0">
          {grades.map((grade, index) => {
            // Position them in a diagonal staircase pattern
            // Start from bottom left (x: 20%, y: 80%) to top right (x: 80%, y: 20%)
            const xPos = 20 + (index * 10);
            const yPos = 80 - (index * 10);
            
            return (
              <div 
                key={grade.id}
                className={`portal-container absolute ${grade.active ? 'active cursor-pointer' : 'opacity-70 grayscale-[50%] cursor-not-allowed'}`}
                style={{ 
                  left: `${xPos}%`, 
                  top: `${yPos}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="portal-number">GRADE {grade.id}</div>
                
                <div className="portal-frame">
                  <div className="portal-inner">
                    <div 
                      className="portal-glow"
                      style={{
                        background: `radial-gradient(circle at bottom, ${grade.color} 0%, transparent 70%)`
                      }}
                    />
                    
                    <div className="portal-emoji" style={{ color: grade.color }}>
                      {grade.emoji}
                    </div>
                    
                    {grade.active && <Particles color={grade.color} />}
                    
                    {!grade.active && (
                      <div className="portal-keyhole" />
                    )}
                  </div>
                </div>
                
                {/* Floor glow reflection */}
                <div 
                  className="absolute -bottom-8 w-32 h-8 rounded-[100%] blur-xl opacity-40 mix-blend-screen"
                  style={{ backgroundColor: grade.color }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
