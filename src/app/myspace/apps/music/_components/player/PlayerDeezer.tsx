'use client';
import { useRef, useState } from 'react';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import useWavesurfer from '@/hooks/use-wavesurfer';
import VolumeSlider from './VolumeSlider';
import { formatDuration } from '@/utils/formatters';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { MdSkipPrevious, MdSkipNext, MdPlayArrow, MdPause, MdVolumeUp, MdVolumeMute, MdQueueMusic } from 'react-icons/md';
import { playNextSong, playPreviousSong, selectCurrentSong } from '@/stores/features/apps/music/deezerSongsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PlayerDeezer = () => {
    const dispatch = useAppDispatch();
    const waveContainerRef = useRef(null);
    const { album, title, artist, preview: audioSrc, duration } = useAppSelector(selectCurrentSong);
    const { handlePlayPause, isPlaying, setAudioVolume, audioVolume, currentTime } = useWavesurfer(waveContainerRef, audioSrc, () => dispatch(playNextSong()));
    const formattedDuration = formatDuration(duration);
    const formattedCurrentTime = formatDuration(currentTime);
    const [isExpanded, setIsExpanded] = useState(false);
    const { leftSidebarWidth } = useMyspaceContext();

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <motion.div 
            className={`flex flex-col bg-gradient-to-r from-gray-900 to-black text-white fixed bottom-0 right-0 z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'h-96' : 'h-20'}`}
            initial={false}
            style={{ left: `${leftSidebarWidth}px` }}
            animate={{ height: isExpanded ? '24rem' : '5rem' }}
        >
            <div className="flex items-center px-4 h-20">
                <AnimatePresence>
                    {audioSrc && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="mr-4"
                        >
                            <Image 
                                src={album?.cover_medium} 
                                alt={title} 
                                width={50} 
                                height={50} 
                                className="rounded-md shadow-lg"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className='flex flex-col justify-center flex-1 min-w-0'>
                    <motion.span 
                        className='text-sm font-bold truncate'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {title}
                    </motion.span>
                    <motion.span 
                        className='text-xs text-gray-400 truncate'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {artist?.name}
                    </motion.span>
                </div>
                <div className='flex items-center gap-4'>
                    <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(playPreviousSong())}
                    >
                        <MdSkipPrevious className="text-white text-2xl" />
                    </motion.button>
                    <motion.button
                        className='play-pause-btn w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={audioSrc && handlePlayPause}
                    >
                        {isPlaying ? <MdPause className="text-white text-2xl" /> : <MdPlayArrow className="text-white text-2xl" />}
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(playNextSong())}
                    >
                        <MdSkipNext className="text-white text-2xl" />
                    </motion.button>
                </div>
                <div className='flex items-center gap-4 ml-4'>
                    <span className='text-xs'>{formattedCurrentTime} / {formattedDuration}</span>
                    <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setAudioVolume(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                    >
                        {audioVolume.isMuted ? <MdVolumeMute className="text-white text-2xl" /> : <MdVolumeUp className="text-white text-2xl" />}
                    </motion.button>
                    {audioSrc && (
                        <div className="relative group">
                            <VolumeSlider
                                audioVolume={audioVolume}
                                onChange={([value]) => setAudioVolume({ isMuted: value <= 0, value })}
                            />
                        </div>
                    )}
                    <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleExpand}
                        className="ml-2"
                    >
                        <MdQueueMusic className="text-white text-2xl" />
                    </motion.button>
                </div>
            </div>
            <motion.div 
                className='flex-1 px-4 overflow-hidden'
                initial={false}
                animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
            >
                <div className='h-full flex items-center justify-center'>
                    <div className='w-64 h-64 relative'>
                        <Image 
                            src={album?.cover_medium} 
                            alt={title} 
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg shadow-2xl"
                        />
                    </div>
                    <div className='ml-8 flex-1'>
                        <h2 className='text-3xl font-bold mb-2'>{title}</h2>
                        <h3 className='text-xl text-gray-300 mb-4'>{artist?.name}</h3>
                        <div className='w-full h-12' ref={waveContainerRef}></div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PlayerDeezer;