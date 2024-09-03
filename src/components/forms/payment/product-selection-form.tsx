import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import ProductTypeBanner from './product-type-banner'
import ButtonHandler from './button-handlers'
import { motion } from 'framer-motion'

type Props = {
  register: UseFormRegister<FieldValues>
  productType: 'APPS' | 'EXTENSIONS' | 'AIMODELS' | 'OTHERS'
  setProductType: React.Dispatch<React.SetStateAction<'APPS' | 'EXTENSIONS' | 'AIMODELS' | 'OTHERS'>>
}

const ProductSelectionForm = ({ register, setProductType, productType }: Props) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
      >
        CREDIT PAYMENT
      </motion.h2>
      <motion.p 
        variants={itemVariants}
        className="text-lg md:text-xl text-center mb-12 text-gray-600 dark:text-gray-300"
      >
        Choose the products and services that align with your needs to ensure an exceptional experience.
      </motion.p>
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <ProductTypeBanner
          register={register}
          setProductType={setProductType}
          productType={productType}
          value="APPS"
          title="Expand Your Application Portfolio"
          text="Discover and acquire additional applications to enhance your capabilities."
          icon="🚀"
        />
        <ProductTypeBanner
          register={register}
          setProductType={setProductType}
          productType={productType}
          value="AIMODELS"
          title="Increase Token Capacity"
          text="Upgrade your token allowance for more extensive AI model interactions."
          icon="🧠"
        />
        <ProductTypeBanner
          register={register}
          setProductType={setProductType}
          productType={productType}
          value="EXTENSIONS"
          title="Enhance Functionality with Extensions"
          text="Add new features and tools to your existing setup for greater efficiency."
          icon="🔧"
        />
        <ProductTypeBanner
          register={register}
          setProductType={setProductType}
          productType={productType}
          value="OTHERS"
          title="Explore Additional Services"
          text="Access other premium services offered by our platform."
          icon="🌟"
        />
      </motion.div>
      <motion.div variants={itemVariants} className="mt-12">
        <ButtonHandler />
      </motion.div>
    </motion.div>
  )
}

export default ProductSelectionForm