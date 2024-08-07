"use client"
import { getYearFromDate } from '@/utils/formatters';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

const PlaylistListItem = ({ id, title, imgSrc, creationDate }) => {
    const createdYear = getYearFromDate(creationDate);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div 
            className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={`/myspace/apps/music/home/playlist/${id}`}>
                <motion.div 
                    className='bg-transparent transition-all duration-300 w-full h-full flex flex-col items-center gap-3'
                    animate={{ y: isHovered ? -5 : 0 }}
                >
                    <motion.div 
                        className='relative w-20 h-20 flex-shrink-0'
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={imgSrc}
                            alt={title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                        />
                    </motion.div>
                    <div className='flex flex-col max-w-20'>
                        <motion.h3 
                            className="text-sm font-bold text-white mb-1 truncate"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                        >
                            {title}
                        </motion.h3>
                        <motion.p 
                            className="text-sm text-gray-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                        >
                            Created in {createdYear}
                        </motion.p>
                    </div>
                    <motion.div
                        className="ml-auto"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </motion.div>
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default PlaylistListItem;