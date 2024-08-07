import React from 'react';
import { motion } from 'framer-motion';
import { showBookPreview } from '@/stores/features/apps/book/viewsSlice'; 
import { useAppDispatch } from '@/hooks/hooks';
import Utils from '@/utils/bookUtils';
import { useRouter } from 'next/navigation'; 

const ViewButtonThumbnail = ({ bookID, bookLink, volumeInfo }) => {
    const utils = new Utils();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleInput = () => {
        dispatch(showBookPreview(bookLink));
        router.push(bookLink);
    };

    return (
        <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-inherit text-decoration-none cursor-pointer"
            onClick={handleInput}
        >
            <motion.img
                initial={{ y: -64, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-lg shadow-md min-w-[128px] min-h-[201px]"
                src={utils.extractThumbnail(volumeInfo)}
                width="128"
                height="201"
                alt='cover'
            />
        </motion.a>
    );
};

export default ViewButtonThumbnail;