import React from 'react';
import './library-books.css';
import { cn } from '@/lib/utils';

const GRADES = [
  { id: 3, label: "English", emoji: "🌍", color: "#FBBF24", height: 260 },
  { id: 4, label: "English", emoji: "✏️", color: "#C084FC", height: 280 },
  { id: 5, label: "English", emoji: "🏗️", color: "#22C55E", height: 300 },
  { id: 6, label: "English", emoji: "🎨", color: "#38BDF8", height: 270 },
  { id: 7, label: "English", emoji: "📊", color: "#A78BFA", height: 290 },
  { id: 8, label: "English", emoji: "📐", color: "#FB923C", height: 310 },
  { id: 9, label: "English", emoji: "🎓", color: "#F87171", height: 280 },
];

export function LibraryBooks() {
  return (
    <div className="relative w-full h-[1080px] max-w-[1920px] mx-auto overflow-hidden bg-[#1a1c29] library-bookshelf-container">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 transition-opacity duration-1000"
        style={{ backgroundImage: 'url("/__mockup/images/hero.png")' }}
      />
      
      {/* Dark overlay for atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-[#111] opacity-40 pointer-events-none" />

      {/* Books Container positioned diagonally to match stairs */}
      <div className="absolute left-[30%] top-[20%] w-[1000px] h-[800px]">
        {GRADES.map((grade, index) => {
          // Diagonal placement roughly matching stairs
          const leftPos = index * 120; 
          const topPos = 500 - index * 65; 
          
          const isUnlocked = grade.id === 5;
          const isLocked = grade.id !== 5;

          return (
            <div 
              key={grade.id} 
              className="absolute" 
              style={{ left: leftPos, top: topPos }}
            >
              <div 
                className={cn(
                  "library-book-wrapper group",
                  isLocked && "cursor-not-allowed",
                  isUnlocked && "cursor-pointer"
                )}
              >
                {/* Book Geometry */}
                <div 
                  className={cn(
                    "library-book relative flex flex-col items-center justify-between py-6", 
                    isLocked ? "locked" : "active"
                  )}
                  style={{ 
                    backgroundColor: grade.color,
                    height: grade.height + 'px',
                    transform: `rotateY(-15deg) rotateX(5deg) rotateZ(${index % 2 === 0 ? 1 : -1}deg)`
                  }}
                >
                  <div className="library-book-emoji">{grade.emoji}</div>
                  
                  <div className="library-book-spine-text flex flex-col items-center mt-2">
                    <span className="opacity-70 text-sm mb-4 tracking-[0.2em]">GRADE</span>
                  </div>
                  
                  <div className="library-book-number">{grade.id}</div>
                  
                  <div className="library-book-spine-text font-bold text-xl opacity-90 mb-4 tracking-widest">
                    {grade.label}
                  </div>
                  
                  {/* Book spine highlights and shadows */}
                  <div className="absolute inset-0 rounded-[4px_12px_12px_4px] shadow-[inset_4px_0_10px_rgba(0,0,0,0.2),inset_-2px_0_5px_rgba(255,255,255,0.3)] pointer-events-none" />
                  <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-white/20 pointer-events-none" />
                  <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-black/10 pointer-events-none" />
                </div>

                {/* Individual shelf segment underneath the book */}
                <div 
                  className="library-shelf"
                  style={{
                    width: '100px',
                    left: '-15px',
                    bottom: '-20px'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
