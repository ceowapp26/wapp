"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaCog, FaUsers, FaBell, FaChartLine, FaLock, FaDatabase } from "react-icons/fa";

const AdminPage = () => {
  const adminFunctions = [
    { icon: FaUsers, title: "User Management" },
    { icon: FaBell, title: "Notifications" },
    { icon: FaChartLine, title: "Analytics" },
    { icon: FaLock, title: "Security Settings" },
    { icon: FaDatabase, title: "Data Management" },
    { icon: FaCog, title: "System Settings" },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 max-h-screen overflow-y-auto w-full">
      <div className="container mx-auto min-h-screen py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              transition: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
            className="inline-block mb-4"
          >
            <FaCog className="text-6xl text-blue-500" />
          </motion.div>
          <h1 className="text-4xl font-bold">Welcome to Admin Page</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFunctions.map((func, index) => (
            <motion.div
              key={func.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <func.icon className="text-4xl mb-4 text-blue-500" />
              <h2 className="text-xl font-semibold">{func.title}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage {func.title.toLowerCase()} settings and configurations.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;