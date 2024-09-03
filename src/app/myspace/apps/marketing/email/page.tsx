"use client"

import React from 'react';
import { motion } from 'framer-motion';

const emailCampaigns = [
  { id: 1, name: 'Welcome Series', subscribers: 5000, openRate: '35%', clickRate: '12%' },
  { id: 2, name: 'Monthly Newsletter', subscribers: 10000, openRate: '28%', clickRate: '8%' },
  { id: 3, name: 'Product Launch', subscribers: 7500, openRate: '42%', clickRate: '15%' },
];

export default function EmailMarketing() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Email Marketing</h1>
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campaign Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subscribers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Open Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Click Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
            {emailCampaigns.map((campaign) => (
              <motion.tr
                key={campaign.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.subscribers.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.openRate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.clickRate}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Subscribers</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">22,500</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">35%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Click Rate</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">11.7%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Campaigns</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200">
              Create New Campaign
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">
              Import Subscribers
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
              View Reports
            </button>
          </div>
        </div>
      </motion.div>
    </React.Fragment>
  );
}