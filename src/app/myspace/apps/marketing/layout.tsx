"use client"
import Sidebar from './_components/sidebar';
import Navbar from './_components/navbar';
import { motion } from 'framer-motion';
import { useMyspaceContext } from '@/context/myspace-context-provider';

export default function MarketingLayout({ children }) {
  const { leftSidebarWidth, isAppbarCollapsed } = useMyspaceContext();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-y-auto">
      <Sidebar />
     <div 
        className={`relative flex-1 h-full w-full overflow-y-auto ${isAppbarCollapsed ? 'top-32' : 'top-64'}`} 
        style={{ marginLeft: `${leftSidebarWidth}px` }}
      >
        <Navbar />
        <motion.main 
          className="flex-1 overflow-x-hidden bg-gray-200 dark:bg-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto px-6 py-8">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}