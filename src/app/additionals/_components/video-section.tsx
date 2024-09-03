"use client"
import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from '@mui/material';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Define custom breakpoints
  const isExtraSmall = useMediaQuery('(max-width:320px)');
  const isSmall = useMediaQuery('(min-width:321px) and (max-width:480px)');
  const isMedium = useMediaQuery('(min-width:481px) and (max-width:768px)');
  const isLarge = useMediaQuery('(min-width:769px)');

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay was prevented:", error);
      });
    }
  }, []);

  // Determine the appropriate variant and className based on screen size
  const getTypographyProps = () => {
    if (isExtraSmall) {
      return { variant: 'h5', className: 'text-xl' };
    } else if (isSmall) {
      return { variant: 'h4', className: 'text-2xl' };
    } else if (isMedium) {
      return { variant: 'h3', className: 'text-3xl' };
    } else {
      return { variant: 'h2', className: 'text-5xl' };
    }
  };

  const { variant, className } = getTypographyProps();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col justify-center items-center w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant={variant as "h2" | "h3" | "h4" | "h5"} 
          component="h1" 
          className={`${className} font-bold mb-6 text-center bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text p-4`}
        >
          AI TECHNOLOGY
        </Typography>
      </motion.div>
      
      <motion.div 
        className="relative w-full rounded-lg overflow-hidden shadow-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <video 
          ref={videoRef}
          width="100%" 
          loop 
          autoPlay 
          muted 
          playsInline 
          preload="auto"
        >
          <source src="./global/videos/placeholder.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>    
      </motion.div>
    </motion.div>
  );
};

export default VideoSection;