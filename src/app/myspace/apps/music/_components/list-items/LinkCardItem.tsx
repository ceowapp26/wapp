"use client"
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

const LinkCardItem = ({ href, imgSrc, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className='w-full p-4'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={href}>
                <motion.div 
                    className='bg-transparent p-6 transition-all duration-300 h-full flex flex-col items-center justify-center text-center'
                    animate={{ y: isHovered ? -5 : 0 }}
                >
                    <motion.div
                        className='relative w-24 h-24 mb-4'
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
                    <motion.h3 
                        className="text-md font-bold text-white mb-2"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                    >
                        {title}
                    </motion.h3>
                    {description && (
                        <motion.p 
                            className="text-sm text-gray-200"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
                        >
                            {description}
                        </motion.p>
                    )}
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default LinkCardItem;