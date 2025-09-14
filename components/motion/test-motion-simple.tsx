"use client";

import dynamic from "next/dynamic";

// Dynamically import Framer Motion to avoid SSR issues
const motion = dynamic(() => import("framer-motion").then(mod => ({ default: mod.motion })), { ssr: false });

export default function TestMotionSimple() {
  return (
    <div className="p-4 bg-green-100 rounded-lg">
      <h3 className="text-lg font-semibold">Framer Motion Test</h3>
      <p className="text-sm text-gray-600 mb-2">
        Testing motion object: {typeof motion}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        Testing motion.div: {typeof motion?.div}
      </p>
      {motion && motion.div ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-2 bg-blue-200 rounded"
        >
          ✅ Framer Motion is working!
        </motion.div>
      ) : (
        <div className="p-2 bg-red-200 rounded">
          ❌ Framer Motion is not working
        </div>
      )}
    </div>
  );
}
