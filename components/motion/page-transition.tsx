"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React from "react";

// Dynamically import Framer Motion to avoid SSR issues
const motion = dynamic(() => import("framer-motion").then(mod => ({ default: mod.motion })), { ssr: false });
const AnimatePresence = dynamic(() => import("framer-motion").then(mod => ({ default: mod.AnimatePresence })), { ssr: false });

const variants = {
  initial: {
    opacity: 0,
    y: 24,
    filter: "blur(6px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as any, // Cast to any to satisfy strict easing type (cubic-bezier tuple)
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(4px)",
    transition: {
      duration: 0.35,
      ease: [0.7, 0, 0.84, 0] as any,
    },
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Fallback if motion isn't loaded for any reason
  if (!motion || !(motion as any).div) {
    return <>{children}</>;
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;