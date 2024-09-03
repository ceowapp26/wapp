'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDuration } from '@/utils/formatters';
import { useAppDispatch } from '@/hooks/hooks';
import { playSong } from '@/stores/features/apps/music/deezerSongsSlice';
import FavoriteButton from '../others/FavoriteButton';
import { Play, Pause } from 'lucide-react';

const TrackListItem = ({ index, playlist, track: { id, title, duration, artist, album, type } }) => {
    const dispatch = useAppDispatch();
    const formattedDuration = formatDuration(duration);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        dispatch(playSong({ index, playlist }));
        setIsPlaying(!isPlaying);
    };

    return (
        <motion.li
            className='flex p-4 gap-4 items-center rounded-lg cursor-pointer transition-all duration-300 ease-out hover:bg-[#0e1a41] relative overflow-hidden'
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
                animate={{ opacity: isHovered ? 0.1 : 0 }}
            />
            <div className="relative w-16 h-16">
                <img className="w-full h-full rounded-lg object-cover" src={album.cover_medium} alt={album.title} />
                <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <button onClick={handlePlay} className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200">
                        {isPlaying ? (
                            <Pause className="w-8 h-8" />
                        ) : (
                            <Play className="w-8 h-8" />
                        )}
                    </button>
                </motion.div>
            </div>
            <div className='flex flex-1 gap-8 items-center'>
                <div className="flex flex-col flex-1 gap-1">
                    <motion.strong 
                        className='overflow-hidden overflow-ellipsis whitespace-nowrap max-w-72 text-truncate text-white text-lg'
                        animate={{ color: isHovered ? '#3b82f6' : '#ffffff' }}
                    >
                        {title}
                    </motion.strong>
                    <Link
                        href={`/myspace/apps/music/home/artist/${artist.id}`}
                        className='overflow-hidden overflow-ellipsis whitespace-nowrap text-blue-400 hover:text-blue-300 transition-colors duration-200'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {artist.name}
                    </Link>
                </div>
                <span className="text-white text-sm">{formattedDuration}</span>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FavoriteButton id={id} type={type} />
                </motion.div>
            </div>
        </motion.li>
    );
};

export default TrackListItem;



