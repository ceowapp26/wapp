'use client';
import { playSong } from '@/stores/features/apps/music/deezerSongsSlice';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/hooks';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const PlayIcon = ({ className }) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <path d="M8 5v14l11-7z" />
    </motion.svg>
);

const fallbackImageUrl = '/path-to-your-fallback-image.jpg'; // Replace with your fallback image path

const SearchResultItem = ({ type, result }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { id, name, title, picture_medium, md5_image } = result;
    const [imageError, setImageError] = useState(false);

    const handleClick = () => {
        if (type === 'track') {
            dispatch(playSong({ playlist: [result], index: 0 }));
        } else {
            router.push(`/myspace/apps/music/home/${type}/${id}`);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl z-[99999]"
        >
            <div className="flex items-center p-4 cursor-pointer group" onClick={handleClick}>
                <motion.div 
                    className="w-16 h-16 mr-4 relative overflow-hidden rounded-md"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                >
                    <Image
                        src={!imageError ? (picture_medium || `https://e-cdns-images.dzcdn.net/images/cover/${md5_image}/250x250-000000-80-0-0.jpg`) : fallbackImageUrl}
                        alt={name || title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md transition-transform duration-300 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                </motion.div>
                <div className="flex-grow max-w-[calc(100%-6rem)]">
                    <motion.h3 
                        className="text-lg font-semibold text-gray-800 dark:text-white truncate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {name || title}
                    </motion.h3>
                    <motion.p 
                        className="text-sm text-gray-600 dark:text-gray-300 capitalize"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {type}
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
};

export default SearchResultItem;