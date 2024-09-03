"use client"

import React from 'react';
import { motion } from 'framer-motion';

const seoMetrics = [
  { id: 1, page: 'Home', rank: 3, traffic: '15K', keywords: 25 },
  { id: 2, page: 'Products', rank: 5, traffic: '8K', keywords: 18 },
  { id: 3, page: 'Blog', rank: 2, traffic: '20K', keywords: 30 },
];

export default function SEO() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">SEO Analytics</h1>
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Page</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Traffic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Keywords</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
            {seoMetrics.map((metric) => (
              <motion.tr
                key={metric.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{metric.page}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{metric.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{metric.traffic}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{metric.keywords}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}