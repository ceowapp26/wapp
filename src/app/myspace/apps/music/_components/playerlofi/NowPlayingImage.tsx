"use client"
import React from "react";
import { motion } from "framer-motion";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import Image from 'next/image';

const NowPlayingImage = () => {
  const { currentSong } = useMyspaceContext();

  return (
    <motion.div
      className="w-full sm:w-64 lg:w-96 relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="art absolute top-4 rounded-lg overflow-hidden shadow-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
       <Image
          src={'/music/images/1624_picasso_wired.png'}
          width={240}
          height={240}
          alt="album art"
          priority
          className="w-full h-auto"
        />
      </motion.div>
    </motion.div>
  );
};

export default NowPlayingImage;