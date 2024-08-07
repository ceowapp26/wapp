"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const TabContentContainer = ({ entities, children }) => {
    const isEmpty = !entities.length;
    const { theme } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
            {isEmpty ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-xl font-semibold mb-4">It seems like this list is empty.</h2>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                        Start exploring and discovering new books today!
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Enjoy the journey!</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
};

export default TabContentContainer;