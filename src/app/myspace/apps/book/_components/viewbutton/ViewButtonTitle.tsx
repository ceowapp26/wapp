import React from 'react';
import { motion } from 'framer-motion';
import { showBookPreview } from '@/stores/features/apps/book/viewsSlice'; 
import { useAppDispatch } from '@/hooks/hooks'; 
import { useRouter } from 'next/navigation'; 
import { useTheme } from 'next-themes';

const ViewButtonTitle = ({ bookID, bookLink, title }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { theme } = useTheme();

    const handleInput = () => {
        dispatch(showBookPreview(bookLink));
        router.push(bookLink);
    };

    return (
        <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`overflow-hidden text-ellipsis text-wrap text-left line-clamp-3 max-h-[100px] w-full my-0 text-2xl font-bold cursor-pointer ${
                theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'
            } transition-all duration-200`}
            onClick={handleInput}
        >
            {title}
        </motion.a>
    );
};

export default ViewButtonTitle;