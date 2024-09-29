import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Zap, Shield, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center text-center"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Icon className="text-pink-400 w-12 h-12 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-300">{description}</p>
  </motion.div>
);

const AnimatedBubble = ({ delay }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-30"
    style={{
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay: delay,
    }}
  />
);

const PromptSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: Layers, title: "Multiple Apps", description: "Access all your tools in one place" },
    { icon: Zap, title: "Lightning Fast", description: "Optimized for speed and efficiency" },
    { icon: Shield, title: "Secure", description: "Enterprise-grade security measures" },
    { icon: Users, title: "Collaborative", description: "Work seamlessly with your team" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {[...Array(5)].map((_, i) => (
        <AnimatedBubble key={i} delay={i * 2} />
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            ALL-IN-ONE PLATFORM
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8">
            Experience the future of seamless integration
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition duration-300"
          >
            <span>Enter Wapp</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PromptSection;