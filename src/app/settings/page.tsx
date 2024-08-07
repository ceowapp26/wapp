'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Moon, Sun, Bell, Lock, User, HelpCircle, X } from "lucide-react";
import Link from 'next/link';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  const settingsItems = [
    { 
      icon: User, 
      title: "Account", 
      description: "Manage your account settings and preferences",
      instructions: "To set up your account:\n1. Click on 'Profile'\n2. Update your personal information\n3. Set your preferred language and timezone\n4. Click 'Save Changes'"
    },
    { 
      icon: Bell, 
      title: "Notifications", 
      description: "Control your notification preferences",
      instructions: "To manage notifications:\n1. Select notification types (email, push, in-app)\n2. Choose frequency (immediate, daily digest, weekly)\n3. Set quiet hours\n4. Save your preferences"
    },
    { 
      icon: Lock, 
      title: "Privacy & Security", 
      description: "Manage your privacy and security settings",
      instructions: "To enhance your security:\n1. Enable two-factor authentication\n2. Review connected devices\n3. Set up a strong, unique password\n4. Control data sharing preferences"
    },
    { 
      icon: HelpCircle, 
      title: "Help & Support", 
      description: "Get help or contact support",
      instructions: "To get help:\n1. Check our FAQ section\n2. Use the search bar to find specific topics\n3. Contact support via chat or email\n4. Schedule a call with our support team if needed"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col dark:bg-gray-900 bg-gray-100 text-gray-800 dark:text-gray-200"
    >
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            WAPP Settings
          </motion.h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          {settingsItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="mr-3 text-blue-500 dark:text-blue-400"
                >
                  <item.icon size={24} />
                </motion.div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/support">
                  <div className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md transition-all duration-300 inline-block cursor-pointer">
                    Learn How
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedSetting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSetting(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{selectedSetting.title} Setup</h3>
                <button onClick={() => setSelectedSetting(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{selectedSetting.instructions}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-white dark:bg-gray-800 shadow-md mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
          © 2024 WAPP. All rights reserved.
        </div>
      </footer>
    </motion.div>
  );
}

export default SettingsPage;

