import React from 'react';
import { Lock } from 'lucide-react';
import './_step-blocks.css';

const grades = [
  { level: 3, icon: '🌍', color: '#FBBF24', darkColor: '#B45309' },
  { level: 4, icon: '✏️', color: '#C084FC', darkColor: '#7E22CE' },
  { level: 5, icon: '🏗️', color: '#22C55E', darkColor: '#15803D' },
  { level: 6, icon: '🎨', color: '#38BDF8', darkColor: '#0369A1' },
  { level: 7, icon: '📊', color: '#A78BFA', darkColor: '#6D28D9' },
  { level: 8, icon: '📐', color: '#FB923C', darkColor: '#C2410C' },
  { level: 9, icon: '🎓', color: '#F87171', darkColor: '#B91C1C' },
];

export function StepBlocks() {
  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden step-blocks-container text-slate-50 flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity"
        style={{ backgroundImage: 'url(/__mockup/images/hero.png)' }}
      />
      
      {/* Ambient Gradient to ground the scene */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-900/80 to-slate-950 pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-[1600px] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 h-full">
        
        {/* Left Side: Copy */}
        <div className="w-full md:w-[40%] mb-16 md:mb-0 text-center md:text-left pt-16 md:pt-0 z-30">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="text-sm font-bold uppercase tracking-wider text-green-400">Current Level</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 drop-shadow-2xl leading-none">
            Resume<br/>Journey
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed drop-shadow-md max-w-lg">
            You're currently mastering Grade 5. Ready to build something new?
          </p>
        </div>

        {/* Right Side: Staircase */}
        <div className="w-full md:w-[60%] h-[600px] md:h-[800px] relative mt-12 md:mt-0">
          <div className="staircase-wrapper">
            {grades.map((grade, index) => {
              const isActive = grade.level === 5;
              const isLocked = grade.level !== 5;
              
              // Position from bottom-left to top-right visually on screen
              // Left: 0% to ~70%
              // Bottom: 0% to ~80%
              const stepCount = grades.length - 1;
              const leftPos = (index / stepCount) * 65 + 10;
              const bottomPos = (index / stepCount) * 75 + 5;

              return (
                <div
                  key={grade.level}
                  className={`step-btn ${isActive ? 'active' : 'locked'}`}
                  style={{
                    left: `${leftPos}%`,
                    bottom: `${bottomPos}%`,
                    // Keep higher levels behind lower levels visually in 2D space overlap
                    zIndex: grades.length - index,
                    '--btn-color': grade.color,
                    '--btn-color-dark': grade.darkColor,
                  } as React.CSSProperties}
                >
                  <div className="step-shadow" />
                  <div className="step-btn-inner">
                    <div className="step-face-top">
                      {isLocked && (
                        <div className="lock-icon-container">
                          <Lock size={20} strokeWidth={3} />
                        </div>
                      )}
                      <div className="step-content">
                        <div className="step-emoji">{grade.icon}</div>
                        <div className="step-label">
                          G{grade.level}
                        </div>
                      </div>
                    </div>
                    <div className="step-face-front" />
                    <div className="step-face-right" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
