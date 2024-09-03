"use client"

import React from "react";
import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Active Campaigns</h2>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">12</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Total Reach</h2>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">1.2M</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Conversion Rate</h2>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">3.8%</p>
        </motion.div>
      </div>
    </React.Fragment>
  );
}