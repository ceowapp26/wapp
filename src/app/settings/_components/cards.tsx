import React from 'react'
import { motion } from 'framer-motion'

type Props = {
  title: string
  value: number
  icon: JSX.Element
  sales?: boolean
  color?: string
}

const DashboardCard = ({ icon, title, value, sales, color = 'blue' }: Props) => {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600',
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${colorClasses[color]} text-white`}
    >
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white bg-opacity-30 rounded-full p-3">
            {icon}
          </div>
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
        <div className="flex items-baseline">
          <p className="font-bold text-4xl">
            {sales && '$'}
            {value.toLocaleString()}
          </p>
          <span className="ml-2 text-sm opacity-75">
            {sales ? 'USD' : 'Total'}
          </span>
        </div>
      </div>
      <div className="px-6 py-4 bg-black bg-opacity-10">
        <div className="flex items-center justify-between text-sm">
          <span>Last 7 days</span>
          <span className="font-semibold">
            {sales ? '+$' : '+'}
            {Math.floor(value * 0.1).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardCard