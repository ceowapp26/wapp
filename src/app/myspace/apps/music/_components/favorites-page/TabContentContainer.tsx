import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const TabContentContainer = ({ entities, children }) => {
    const isEmpty = !entities.length;
    const { theme } = useTheme();

    return (
        <div className={`text-center p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            {isEmpty ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        It seems like this list is empty.
                    </h2>
                    <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text">
                        Start exploring and discovering new music today!
                    </h2>
                    <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Enjoy the journey!
                    </p>
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
        </div>
    );
};

export default TabContentContainer;