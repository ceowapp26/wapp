import React from 'react';
import { motion } from 'framer-motion';
import { addToLists, removeFromLists, selectLibraryBooks } from "@/stores/features/apps/book/libraryBooksSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useTheme } from 'next-themes';

const EditListButton = ({ id, category, iconAdd, iconRemove }) => {
    const dispatch = useAppDispatch();
    const books = useAppSelector(selectLibraryBooks);
    const { theme } = useTheme();

    const isInList = books[category].find(bookId => bookId === id);

    const handleClick = (e) => {
        e.stopPropagation();
        isInList
            ? dispatch(removeFromLists({ category, id }))
            : dispatch(addToLists({ category, id }));
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${
                isInList 
                    ? 'bg-blue-500 text-white' 
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
            } transition-colors duration-200`}
            onClick={handleClick}
        >
            {isInList ? iconAdd : iconRemove}
        </motion.button>
    );
};

export default EditListButton;
