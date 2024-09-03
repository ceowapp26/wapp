import { motion, AnimatePresence } from 'framer-motion';

export default function Notification({ message, type, isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 px-4 py-2 rounded-md text-white ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <p>{message}</p>
          <button
            onClick={onClose}
            className="absolute top-1 right-1 text-white hover:text-gray-200"
          >
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}