import React, { useState } from 'react'
import { motion } from 'framer-motion'

const OtherPriceCard = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const services = [
    { name: 'Custom AI Model Training', price: 99.99 },
    { name: 'Data Analytics Dashboard', price: 49.99 },
    { name: 'API Access', price: 29.99 },
    { name: 'Premium Support', price: 19.99 },
    { name: 'Cloud Storage (100GB)', price: 9.99 },
    { name: 'Automated Reporting', price: 14.99 },
  ]

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(name => name !== serviceName)
        : [...prev, serviceName]
    )
  }

  const totalPrice = selectedServices.reduce((total, service) => {
    const servicePrice = services.find(s => s.name === service)?.price || 0
    return total + servicePrice
  }, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Additional Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`bg-white dark:text-gray-800 rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 ${
              selectedServices.includes(service.name)
                ? 'border-2 border-blue-500'
                : 'border border-gray-200 hover:shadow-lg'
            }`}
            onClick={() => toggleService(service.name)}
          >
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-800">{service.name}</h3>
            <p className="text-2xl font-bold text-blue-600">${service.price.toFixed(2)}</p>
            <div className="mt-4">
              <motion.div
                initial={false}
                animate={{ scale: selectedServices.includes(service.name) ? 1 : 0 }}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Selected Services</h3>
        {selectedServices.length > 0 ? (
          <ul className="mb-4">
            {selectedServices.map((service) => (
              <li key={service} className="flex justify-between items-center mb-2">
                <span>{service}</span>
                <span className="font-semibold">${services.find(s => s.name === service)?.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-gray-600">No services selected</p>
        )}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Proceed to Checkout
      </motion.button>
    </div>
  )
}

export default OtherPriceCard