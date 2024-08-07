import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaPlus, FaComments, FaUsers } from 'react-icons/fa';

const ForumContent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const forumCategories = [
    { id: 1, name: 'General Discussion', threads: 150, posts: 1200 },
    { id: 2, name: 'Technical Support', threads: 80, posts: 560 },
    { id: 3, name: 'Feature Requests', threads: 45, posts: 320 },
    { id: 4, name: 'Off-Topic', threads: 30, posts: 180 },
  ];

  const filteredCategories = forumCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center">Forum</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search forums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <motion.button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full inline-flex items-center transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-2" /> New Thread
        </motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredCategories.map(category => (
          <motion.div 
            key={category.id} 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <p>Threads: {category.threads}</p>
              <p>Posts: {category.posts}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Forum Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <FaComments className="text-blue-500 mr-2" size={24} />
            <div>
              <p className="font-semibold">Total Threads</p>
              <p className="text-2xl">{forumCategories.reduce((sum, cat) => sum + cat.threads, 0)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaComments className="text-green-500 mr-2" size={24} />
            <div>
              <p className="font-semibold">Total Posts</p>
              <p className="text-2xl">{forumCategories.reduce((sum, cat) => sum + cat.posts, 0)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaUsers className="text-purple-500 mr-2" size={24} />
            <div>
              <p className="font-semibold">Active Users</p>
              <p className="text-2xl">250</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ForumContent;