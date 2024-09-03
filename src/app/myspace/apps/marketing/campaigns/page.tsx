"use client"

import React from "react";
import { motion } from 'framer-motion';

const campaigns = [
  { id: 1, name: 'Summer Sale', status: 'Active', reach: '500K', conversions: '2.5%' },
  { id: 2, name: 'New Product Launch', status: 'Scheduled', reach: '750K', conversions: '3.1%' },
  { id: 3, name: 'Brand Awareness', status: 'Completed', reach: '1.2M', conversions: '1.8%' },
];

export default function Campaigns() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Campaigns</h1>
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reach</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conversions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
            {campaigns.map((campaign) => (
              <motion.tr
                key={campaign.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    campaign.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                    campaign.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.reach}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.conversions}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}