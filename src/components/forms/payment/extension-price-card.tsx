import React from 'react'
import { motion } from 'framer-motion'

const ExtensionPriceCard = () => {
  const extensions = [
    { name: 'Productivity Pack', price: 4.99, features: ['Task Manager', 'Calendar Integration', 'Notes Sync', 'Debugger'] },
    { name: 'Developer Tools', price: 9.99, features: ['Code Editor', 'Version Control', 'Debugger', 'API Testing'] },
    { name: 'Creative Suite', price: 14.99, features: ['Image Editor', 'Vector Graphics', 'Audio Mixer', 'Video Editor'] },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Enhance Your Workflow with Extensions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {extensions.map((extension, index) => (
          <motion.div
            key={extension.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-800">{extension.name}</h3>
              <p className="text-3xl font-bold mb-4 dark:text-gray-800">${extension.price}<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-2">
                {extension.features.map((feature, i) => (
                  <li key={i} className="flex items-center dark:text-gray-800">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-50">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                Add Extension
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ExtensionPriceCard