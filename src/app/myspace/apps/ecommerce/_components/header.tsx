"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Header({ toggleTheme, toggleSidebar }) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="text-gray-800 dark:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">Home</Link></li>
            <li><Link href="/products" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">Products</Link></li>
            <li><Link href="/cart" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">Cart</Link></li>
          </ul>
        </nav>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="text-gray-800 dark:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </motion.button>
      </div>
    </header>
  );
}