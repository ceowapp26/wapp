"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentPage: React.FC = () => {
  const { theme } = useTheme();
  const [planDetails, setPlanDetails] = useState({
    productId: '',
    name: '',
    description: '',
    price: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlanDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/paypal/create_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: planDetails.productId,
          name: planDetails.name,
          description: planDetails.description,
          status: "ACTIVE",
          billing_cycles: [
            {
              frequency: {
                interval_unit: "MONTH",
                interval_count: 1
              },
              tenure_type: "REGULAR",
              sequence: 1,
              total_cycles: 0,
              pricing_scheme: {
                fixed_price: {
                  value: planDetails.price,
                  currency_code: "USD"
                }
              }
            }
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
              value: "0",
              currency_code: "USD"
            },
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3
          }
        }),
      });
      if (response.ok) {
        const result = await response.json();
        toast.success('Plan created successfully!');
        console.log('Created Plan:', result);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to create plan: ${errorData.error}`);
        console.error('Error details:', errorData.details);
      }
    } catch (error) {
      toast.error('Error creating plan');
      console.error('Error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${
        theme === 'dark' ? 'from-gray-900 to-gray-800' : 'from-gray-100 to-white'
      }`}
    >
      <div className={`w-full max-w-md p-8 space-y-8 rounded-xl shadow-2xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-extrabold text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Create Subscription Plan
        </motion.h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                id="productId"
                name="productId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Product ID"
                value={planDetails.productId}
                onChange={handleInputChange}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Plan Name"
                value={planDetails.name}
                onChange={handleInputChange}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <textarea
                id="description"
                name="description"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Plan Description"
                value={planDetails.description}
                onChange={handleInputChange}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Price (USD)"
                value={planDetails.price}
                onChange={handleInputChange}
              />
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Create Plan
            </button>
          </motion.div>
        </form>
      </div>
      <ToastContainer position="bottom-right" theme={theme === 'dark' ? 'dark' : 'light'} />
    </motion.div>
  );
};

export default PaymentPage;