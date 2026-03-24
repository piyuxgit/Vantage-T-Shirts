import { motion } from 'motion/react';

export default function LandingAnimation({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 3 }}
      onAnimationComplete={onComplete}
    >
      <div className="text-center relative">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-neon/20 blur-[100px] rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.h1
          className="text-8xl md:text-[12rem] font-bold tracking-tighter leading-none italic font-serif"
          initial={{ y: 40, opacity: 0, skewX: -10 }}
          animate={{ y: 0, opacity: 1, skewX: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          VANTAGE
        </motion.h1>
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="h-[1px] w-12 bg-neon"></span>
          <p className="text-[10px] tracking-[0.8em] uppercase font-mono text-neon">
            Studio_Edition_2026
          </p>
          <span className="h-[1px] w-12 bg-neon"></span>
        </motion.div>
      </div>
    </motion.div>
  );
}
