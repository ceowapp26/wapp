"use client"

import React from 'react';
import { motion } from 'framer-motion';

const socialPosts = [
  { id: 1, platform: 'Twitter', content: 'Check out our latest product!', engagement: 1500, scheduled: '2023-08-20' },
  { id: 2, platform: 'Facebook', content: 'Join us for our upcoming webinar', engagement: 2200, scheduled: '2023-08-22' },
  { id: 3, platform: 'Instagram', content: 'Behind the scenes at our office', engagement: 3000, scheduled: '2023-08-25' },
];

export default function SocialManagement() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Social Media Management</h1>
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Engagement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Scheduled</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
            {socialPosts.map((post) => (
              <motion.tr
                key={post.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{post.platform}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{post.content}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{post.engagement}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{post.scheduled}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}