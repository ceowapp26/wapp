import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

type Props = {
  value: string
  title: string
  text: string
  register: UseFormRegister<FieldValues>
  productType: 'APPS' | 'EXTENSIONS' | 'AIMODELS' | 'OTHERS'
  setProductType: React.Dispatch<React.SetStateAction<'APPS' | 'EXTENSIONS' | 'AIMODELS' | 'OTHERS'>>
}

const ProductTypeBanner = ({
  register,
  text,
  title,
  productType,
  setProductType,
  value,
}: Props) => {
  const isSelected = productType === value

  return (
    <motion.label
      htmlFor={value}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`block cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
        isSelected ? 'border-2 border-orange' : 'border border-gray-200'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full ${isSelected ? 'bg-orange text-white' : 'bg-gray-100 text-gray-400'}`}>
            <ShieldCheck size={24} />
          </div>
          <div className="ml-4">
            <h3 className={`text-lg font-semibold ${isSelected ? 'text-orange' : 'text-gravel dark:text-gray-300'}`}>{title}</h3>
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <motion.div
            initial={false}
            animate={{ scale: isSelected ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-6 rounded-full bg-orange flex items-center justify-center"
          >
            <motion.div
              initial={false}
              animate={{ opacity: isSelected ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-3 h-3 bg-white rounded-full"
            />
          </motion.div>
        </div>
      </div>
      <input
        {...register('type', {
          onChange: (e) => setProductType(e.target.value as 'APPS' | 'EXTENSIONS' | 'AIMODELS' | 'OTHERS'),
        })}
        value={value}
        id={value}
        className="hidden"
        type="radio"
      />
    </motion.label>
  )
}

export default ProductTypeBanner
