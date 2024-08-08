import React from 'react'
import { motion } from 'framer-motion'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import PlanTypeBanner from './plan-type-banner'
import ButtonHandler from './button-handlers'

type Props = {
  register: UseFormRegister<FieldValues>
  planType: 'STANDARD' | 'PRO' | 'ULTIMATE'
  setPlanType: React.Dispatch<React.SetStateAction<'STANDARD' | 'PRO' | 'ULTIMATE'>>
}

const PlanSelectionForm = ({ register, setPlanType, planType }: Props) => {
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
      className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        PLAN SUBSCRIPTION
      </motion.h2>
      <motion.p 
        variants={itemVariants}
        className="text-lg md:text-xl text-center mb-12 text-gray-600 dark:text-gray-300"
      >
        Choose the subscription plan that best suits your needs for an optimal experience.
      </motion.p>
      <motion.div variants={containerVariants} className="space-y-6">
        <PlanTypeBanner
          register={register}
          setPlanType={setPlanType}
          planType={planType}
          value="STANDARD"
          title="Register as STANDARD user"
          text="Perfect for individuals looking to explore wapp's features."
        />
        <PlanTypeBanner
          register={register}
          setPlanType={setPlanType}
          planType={planType}
          value="PRO"
          title="Register as PRO user"
          text="Ideal for professionals seeking advanced capabilities and support."
        />
        <PlanTypeBanner
          register={register}
          setPlanType={setPlanType}
          planType={planType}
          value="ULTIMATE"
          title="Register as ULTIMATE user"
          text="Comprehensive solution for businesses and power users."
        />
      </motion.div>
      <motion.div variants={itemVariants} className="mt-12">
        <ButtonHandler />
      </motion.div>
    </motion.div>
  )
}

export default PlanSelectionForm