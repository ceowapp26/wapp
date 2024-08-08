'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { ShieldCheck, Award, Zap } from 'lucide-react'

type Props = {
  value: 'STANDARD' | 'PRO' | 'ULTIMATE'
  title: string
  text: string
  register: UseFormRegister<FieldValues>
  planType: 'STANDARD' | 'PRO' | 'ULTIMATE'
  setPlanType: React.Dispatch<React.SetStateAction<'STANDARD' | 'PRO' | 'ULTIMATE'>>
}

const PlanTypeBanner = ({
  register,
  text,
  title,
  planType,
  setPlanType,
  value,
}: Props) => {
  const isSelected = planType === value

  const getIcon = (value: string) => {
    switch (value) {
      case 'STANDARD':
        return <ShieldCheck size={24} />
      case 'PRO':
        return <Award size={24} />
      case 'ULTIMATE':
        return <Zap size={24} />
      default:
        return <ShieldCheck size={24} />
    }
  }

  return (
    <motion.label
      htmlFor={value}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        block cursor-pointer rounded-xl overflow-hidden transition-all duration-300
        bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl
        ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : 'ring-1 ring-gray-200 dark:ring-gray-700'}
      `}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`
            p-3 rounded-full
            ${isSelected 
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
          `}>
            {getIcon(value)}
          </div>
          <div className="ml-4">
            <h3 className={`
              text-lg font-semibold mb-1
              ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}
            `}>
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <motion.div
            initial={false}
            animate={{ scale: isSelected ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </motion.div>
        </div>
      </div>
      <input
        {...register('type', {
          onChange: (e) => setPlanType(e.target.value as 'STANDARD' | 'PRO' | 'ULTIMATE'),
        })}
        value={value}
        id={value}
        className="hidden"
        type="radio"
      />
    </motion.label>
  )
}

export default PlanTypeBanner