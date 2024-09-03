import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaComments, FaCalendarAlt, FaForumbee, FaRocketchat, FaUserCircle, FaBook } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title }) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4"
    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="text-4xl text-primary" />
    <span className="text-lg font-semibold">{title}</span>
  </motion.div>
);

const CommunityContent = () => {
  return (
    <motion.div 
      className="community-page bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-800 dark:text-gray-200 py-16 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-5xl font-bold text-center mb-16 p-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-50"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Our Thriving Community
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: FaUsers, title: "10,000+", subtitle: "Active Members" },
            { icon: FaComments, title: "5,000+", subtitle: "Daily Discussions" },
            { icon: FaCalendarAlt, title: "100+", subtitle: "Monthly Events" },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <stat.icon className="text-6xl text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-2">{stat.title}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Community Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={FaForumbee} title="Discussion Forums" />
            <FeatureCard icon={FaRocketchat} title="Live Chat" />
            <FeatureCard icon={FaUserCircle} title="Member Profiles" />
            <FeatureCard icon={FaBook} title="Resource Library" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Be part of our growing network of professionals and enthusiasts. Connect, learn, and grow together!</p>
          <motion.button 
            className="bg-black hover:bg-gray-400 hover:text-gray-900 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up Now
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommunityContent;