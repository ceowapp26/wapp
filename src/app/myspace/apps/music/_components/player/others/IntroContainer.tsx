'use client';
import React, { useState } from 'react';
import { playSong } from '@/stores/features/apps/music/deezerSongsSlice';
import { FaPlay, FaPause } from 'react-icons/fa';
import FavoriteButton from './FavoriteButton';
import { useAppDispatch } from '@/hooks/hooks';
import { motion } from 'framer-motion';

const IntroContainer = ({ id, imgSrc, title, description, playlist, type }) => {
    const dispatch = useAppDispatch();
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
        dispatch(playSong({ playlist, index: 0 }));
        setIsPlaying(!isPlaying);
    };

    return (
        <motion.div 
            className='intro-container flex flex-col md:flex-row items-center gap-8 p-6 bg-gradient-to-r from-purple-700 to-pink-500 rounded-xl shadow-2xl'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.img 
                src={imgSrc} 
                alt={title} 
                className="w-40 h-40 md:w-64 md:h-64 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            />
            <div className='intro-details text-white text-center md:text-left'>
                <motion.h2 
                    className="text-3xl md:text-4xl font-bold mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {title}
                </motion.h2>
                <motion.p 
                    className="text-sm md:text-base mb-6 opacity-80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {description}
                </motion.p>
                
                <div className='intro-buttons flex flex-col sm:flex-row gap-4 justify-center md:justify-start'>
                    <motion.button
                        className='play-button bg-white text-purple-700 px-8 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all duration-300'
                        onClick={handlePlayClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
                        <span className="font-semibold">{isPlaying ? 'Pause' : 'Play'}</span>
                    </motion.button>
                    <FavoriteButton type={type} id={id} />
                </div>
            </div>
        </motion.div>
    );
};

export default IntroContainer;