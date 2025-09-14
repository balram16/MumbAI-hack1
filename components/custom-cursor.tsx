"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Framer Motion to avoid SSR issues
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });
const useMotionValue = dynamic(() => import('framer-motion').then(mod => ({ default: mod.useMotionValue })), { ssr: false });
const useSpring = dynamic(() => import('framer-motion').then(mod => ({ default: mod.useSpring })), { ssr: false });

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || 
          target.tagName.toLowerCase() === 'button' || 
          target.closest('button') || 
          target.closest('a') ||
          target.style.cursor === 'pointer') {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isVisible ? (isPointer ? 1.5 : 1) : 0,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale: { duration: 0.2 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className={`w-full h-full rounded-full border-2 transition-all duration-200 ${
          isPointer 
            ? 'border-white bg-white/20' 
            : 'border-violet-400 bg-violet-400/20'
        }`} />
      </motion.div>
      
      {/* Glowing trail */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9998] opacity-60"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: 14,
          translateY: 14,
        }}
        animate={{
          scale: isVisible ? 1 : 0,
        }}
        transition={{
          scale: { duration: 0.4, delay: 0.1 },
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 blur-sm" />
      </motion.div>
    </>
  );
}
