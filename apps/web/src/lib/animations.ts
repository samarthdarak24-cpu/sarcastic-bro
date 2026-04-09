import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2, ease: "easeInOut" }
};

export const tapScale = {
  scale: 0.95,
  transition: { duration: 0.1, ease: "easeInOut" }
};

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const expandWidth: Variants = {
  hidden: { width: 0, opacity: 0 },
  visible: { 
    width: "auto", 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const expandHeight: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: "auto", 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const bounce = {
  y: [0, -10, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const shimmer = {
  backgroundPosition: ["200% 0", "-200% 0"],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }
};

// Additional variants for Farm Insights
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// ============================================
// ADVANCED ANIMATIONS - NEW RELEASE
// ============================================

// 3D Flip Animation
export const flip3D: Variants = {
  hidden: { 
    opacity: 0, 
    rotateY: -90,
    transformPerspective: 1000
  },
  visible: { 
    opacity: 1, 
    rotateY: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

// Elastic Bounce
export const elasticBounce: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.8
    }
  }
};

// Slide and Rotate
export const slideRotate: Variants = {
  hidden: { 
    x: -100, 
    rotate: -180, 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    rotate: 0, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

// Zoom Rotate
export const zoomRotate: Variants = {
  hidden: { 
    scale: 0, 
    rotate: 0, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    rotate: 360, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

// Morph Scale
export const morphScale: Variants = {
  hidden: { 
    scale: 0.5, 
    borderRadius: "50%",
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    borderRadius: "0%",
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: "easeOut"
    }
  }
};

// Glitch Effect
export const glitchEffect: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  hover: {
    x: [0, -2, 2, -2, 2, 0],
    y: [0, 2, -2, 2, -2, 0],
    transition: { 
      duration: 0.3,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

// Parallax Scroll
export const parallaxScroll = (speed: number = 0.5) => ({
  y: 0,
  transition: {
    type: "spring",
    stiffness: 100,
    damping: 30
  }
});

// Magnetic Pull
export const magneticPull: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

// Reveal Text
export const revealText: Variants = {
  hidden: { 
    clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
    opacity: 0
  },
  visible: { 
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    opacity: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.77, 0, 0.175, 1]
    }
  }
};

// Stagger Fast
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Stagger Slow
export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// Wave Animation
export const wave: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2, ease: "easeInOut" },
      opacity: { duration: 0.5 }
    }
  }
};

// Typewriter
export const typewriter: Variants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 2,
      ease: "steps(40)"
    }
  }
};

// Spotlight
export const spotlight = {
  rest: { 
    background: "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0) 0%, transparent 70%)"
  },
  hover: {
    background: "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
    transition: { duration: 0.3 }
  }
};

// Ripple
export const ripple = {
  initial: { scale: 0, opacity: 1 },
  animate: {
    scale: 4,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Neon Glow
export const neonGlow: Variants = {
  hidden: { 
    opacity: 0,
    filter: "drop-shadow(0 0 0px rgba(34, 197, 94, 0))"
  },
  visible: { 
    opacity: 1,
    filter: [
      "drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))",
      "drop-shadow(0 0 20px rgba(34, 197, 94, 1))",
      "drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))"
    ],
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Card Tilt 3D
export const cardTilt3D = {
  rest: { 
    rotateX: 0, 
    rotateY: 0,
    scale: 1
  },
  hover: {
    rotateX: 5,
    rotateY: 5,
    scale: 1.02,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Gradient Shift
export const gradientShift: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Floating Continuous
export const floatingContinuous = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shake Horizontal
export const shakeHorizontal: Variants = {
  rest: { x: 0 },
  shake: {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  }
};

// Blur In
export const blurIn: Variants = {
  hidden: { 
    opacity: 0, 
    filter: "blur(10px)" 
  },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.6 }
  }
};

// Slide Fade
export const slideFade: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50,
    filter: "blur(5px)"
  },
  visible: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};
