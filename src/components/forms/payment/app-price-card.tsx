import React from 'react'
import { motion } from 'framer-motion'

const AppPriceCard = () => {
  const apps = [
    { name: 'Basic Suite', price: 9.99, features: ['3 Apps', 'Basic Support', '1GB Storage', 'Advanced Analytics'] },
    { name: 'Pro Suite', price: 19.99, features: ['10 Apps', 'Priority Support', '5GB Storage', 'Advanced Analytics'] },
    { name: 'Enterprise Suite', price: 49.99, features: ['Unlimited Apps', '24/7 Support', '20GB Storage', 'Custom Integration'] },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your App Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apps.map((app, index) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-800">{app.name}</h3>
              <p className="text-3xl font-bold mb-4 dark:text-gray-800">${app.price}<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-2">
                {app.features.map((feature, i) => (
                  <li key={i} className="flex items-center dark:text-gray-800">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-50">
              <button className="w-full bg-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                Select Plan
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AppPriceCard