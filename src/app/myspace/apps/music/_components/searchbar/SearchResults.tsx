'use client';

import useSWR from 'swr';
import SearchResultItem from './SearchResultItem';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingSpinner = () => (
    <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SearchResults = ({ query }) => {
    const { data: resultsObj = {}, error, isLoading } = useSWR(query, async () => {
        const response = await fetch(`/api/search?q=${query}`);
        return await response.json();
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {query && (
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-gray-600 dark:text-gray-300"
                        >
                            <LoadingSpinner />
                            <p>Searching...</p>
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-red-500"
                        >
                            Something went wrong. Please try again.
                        </motion.div>
                    )}
                    {!isLoading && !error && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {Object.keys(resultsObj).map((type) => (
                                <motion.div key={type} className="mb-8" variants={itemVariants}>
                                    <h2 className="text-2xl font-bold mb-4 text-fuchsia-600/80 capitalize">
                                        {type + 's'}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {!resultsObj[type].length ? (
                                            <p className="text-fuchsia-600/50 col-span-full">
                                                No {type}s found. Please try a different search term.
                                            </p>
                                        ) : (
                                            resultsObj[type].map((result) => (
                                                <SearchResultItem
                                                    key={result.id}
                                                    type={type}
                                                    result={result}
                                                />
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default SearchResults;


