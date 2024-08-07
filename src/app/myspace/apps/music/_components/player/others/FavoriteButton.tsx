'use client';
import { useState, useEffect } from 'react';
import { addToFavorites, removeFromFavorites, selectFavorites } from "@/stores/features/apps/music/favoritesSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { motion, AnimatePresence } from 'framer-motion';

const FavoriteButton = ({ type, id }) => {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector(selectFavorites);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setIsFavorite(favorites[type].find(favoriteId => favoriteId === id));
    }, [favorites, type, id]);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        const action = isFavorite ? removeFromFavorites : addToFavorites;
        dispatch(action({ type, id }));
    };

    return (
        <div className="relative">
            <motion.button
                className="favorite-button p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                onClick={handleFavoriteClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence>
                    {isFavorite ? (
                        <motion.div
                            key="filled"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AiFillHeart className="text-red-500 text-2xl" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="outline"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AiOutlineHeart className="text-gray-500 text-2xl" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
            {/*<AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-[99999]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    </motion.div>
                )}
            </AnimatePresence>*/}
        </div>
    );
};

export default FavoriteButton;