"use client"

import React from 'react';
import { motion } from 'framer-motion';

const adCampaigns = [
  { id: 1, name: 'Summer Sale Ads', platform: 'Google Ads', budget: '$5000', performance: 'High' },
  { id: 2, name: 'Retargeting Campaign', platform: 'Facebook Ads', budget: '$3000', performance: 'Medium' },
  { id: 3, name: 'Brand Awareness', platform: 'LinkedIn Ads', budget: '$2000', performance: 'Low' },
];

export default function AdManagement() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Ad Campaign Management</h1>
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campaign Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Performance</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
            {adCampaigns.map((campaign) => (
              <motion.tr
                key={campaign.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.platform}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{campaign.budget}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    campaign.performance === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                    campaign.performance === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {campaign.performance}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}