import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowDownCircle, Sparkles } from 'lucide-react';

const EnhancedInnovativeTransition = () => {
  const dividerRef = useRef(null);
  const isInView = useInView(dividerRef, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 }
  };

  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1 }
  };

  return (
    <div ref={dividerRef} className="transition-section z-50 dark:shadow-blue relative py-32 rounded-b-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={particleVariants}
            initial="hidden"
            animate={controls}
            transition={{
              duration: 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </motion.div>

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M0,50 Q250,0 500,50 T1000,50"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="4"
          variants={lineVariants}
          initial="hidden"
          animate={controls}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`
        }}
      />
      <div className="relative container mx-auto px-6 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Innovating the Future
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto mb-8"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Where AI meets human creativity, we're shaping tomorrow's technology.
          </motion.p>
        </motion.div>
      </div>
      <motion.div 
        className="absolute bottom-8 w-full flex items-center justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(167, 139, 250, 0.5)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ArrowDownCircle className="h-8 w-8 text-white" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-4 right-4"
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <Sparkles className="h-12 w-12 text-yellow-400" />
      </motion.div>
    </div>
  );
};

export default EnhancedInnovativeTransition;


