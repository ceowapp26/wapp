'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Edit3, FileText } from 'lucide-react'

const AdditionalUpdate = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { isLoaded, isSignedIn, user } = useUser()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await user.update({
        firstName: data.firstName,
        lastName: data.lastName,
        unsafeMetadata: {
          customName: data.customName,
          customBio: data.customBio,
        },
      })
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <User className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            {...register("firstName", { required: "First name is required" })}
            placeholder="First Name"
            className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>
        <div className="relative">
          <User className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Last Name"
            className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
        <div className="relative">
          <Edit3 className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            {...register("customName", { required: "Custom name is required" })}
            placeholder="Custom Name"
            className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
          {errors.customName && <p className="mt-1 text-sm text-red-600">{errors.customName.message}</p>}
        </div>
        <div className="relative">
          <FileText className="absolute top-3 left-3 text-gray-400" size={20} />
          <textarea
            {...register("customBio", { required: "Custom bio is required" })}
            placeholder="Custom Bio"
            rows="4"
            className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none"
          ></textarea>
          {errors.customBio && <p className="mt-1 text-sm text-red-600">{errors.customBio.message}</p>}
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </motion.div>
      </form>
      {updateSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded-md text-center"
        >
          Profile updated successfully!
        </motion.div>
      )}
    </motion.div>
  )
}

export default AdditionalUpdate