"use client"

import React from "react";
import { motion } from 'framer-motion';

const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', lastContact: '2023-08-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', lastContact: '2023-07-22' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', lastContact: '2023-08-10' },
];

export default function CRM() {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Customer Relationship Management</h1>
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Contact</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
            {customers.map((customer) => (
              <motion.tr
                key={customer.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{customer.lastContact}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}