import { motion } from 'motion/react';

interface BubblesIconProps {
  className?: string;
  size?: number;
}

export function BubblesIcon({ className = '', size = 40 }: BubblesIconProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Animated bubble distortion */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scaleX: [1, 1.04, 0.98, 1.01, 1],
          scaleY: [1, 0.98, 1.04, 0.99, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Main bubble body */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {/* Base gradient */}
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(135deg, rgba(173,216,230,0.8) 0%, rgba(100,149,237,0.6) 100%)',
                'linear-gradient(135deg, rgba(255,182,193,0.8) 0%, rgba(255,105,180,0.6) 100%)',
                'linear-gradient(135deg, rgba(216,191,216,0.8) 0%, rgba(186,85,211,0.6) 100%)',
                'linear-gradient(135deg, rgba(152,251,152,0.8) 0%, rgba(60,179,113,0.6) 100%)',
                'linear-gradient(135deg, rgba(173,216,230,0.8) 0%, rgba(100,149,237,0.6) 100%)',
              ]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Swirling rainbow gradient */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-50"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,200,100,0.4) 25%, rgba(150,200,255,0.4) 60%, rgba(200,150,255,0.4) 85%, transparent 100%)'
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)'
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2
            }}
          />
        </div>

        {/* Large highlight */}
        <div 
          className="absolute rounded-full bg-white/70 blur-sm" 
          style={{
            top: size * 0.125,
            left: size * 0.125,
            width: size * 0.375,
            height: size * 0.375,
          }}
        />
        
        {/* Small highlight */}
        <div 
          className="absolute rounded-full bg-white/90" 
          style={{
            top: size * 0.0625,
            left: size * 0.0625,
            width: size * 0.1875,
            height: size * 0.1875,
          }}
        />
        
        {/* Bottom reflection */}
        <div 
          className="absolute rounded-full bg-white/30 blur-[2px]" 
          style={{
            bottom: size * 0.125,
            right: size * 0.125,
            width: size * 0.25,
            height: size * 0.25,
          }}
        />

        {/* Border */}
        <div className="absolute inset-0 rounded-full border-2 border-white/40" />
      </motion.div>
    </div>
  );
}
