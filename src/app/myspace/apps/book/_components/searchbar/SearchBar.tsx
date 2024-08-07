"use client";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { setSearchValue, selectSearchs } from '@/stores/features/apps/book/searchsSlice';
import { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useTheme } from 'next-themes';

const SearchBar = forwardRef((props, ref) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchTerm = useAppSelector(selectSearchs);
    const [isFocused, setIsFocused] = useState(false);
    const { theme } = useTheme();

    const handleInput = (event) => {
        const newValue = event.target.value;
        dispatch(setSearchValue(newValue));
    };

    const clearSearch = () => {
        dispatch(setSearchValue(''));
    };

    const isDarkTheme = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex justify-between items-center p-4 md:p-8 w-full ${
                isDarkTheme ? 'bg-gray-800' : 'bg-white'
            }`}
        >
            <motion.div
                animate={{
                    scale: isFocused ? 1.01 : 1,
                    boxShadow: isFocused
                        ? '0 0 0 3px rgba(66, 153, 225, 0.5)'
                        : '0 1px 3px rgba(0,0,0,0.1)',
                }}
                transition={{ duration: 0.3 }}
                className={`relative flex-grow flex items-center rounded-full overflow-hidden ${
                    isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'
                }`}
            >
                <FaSearch className={`absolute left-4 ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                    id="search"
                    ref={ref}
                    onChange={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full py-3 pl-12 pr-12 ${
                        isDarkTheme
                            ? 'bg-gray-700 text-white placeholder-gray-400'
                            : 'bg-gray-100 text-gray-800 placeholder-gray-500'
                    } focus:outline-none transition-colors duration-200`}
                    placeholder="Search books by name, author, genre and etc ..."
                    aria-label="Search books"
                    value={searchTerm}
                />
                <AnimatePresence>
                    {searchTerm && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={clearSearch}
                            className="absolute right-4"
                        >
                            <FaTimes className={`${
                                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                            } hover:text-gray-700`} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;