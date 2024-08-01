'use client'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link'
import { motion } from 'framer-motion'

const ViewProfile = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  
  if (!isLoaded || !isSignedIn) {
    return null
  }

  const profileInfo = [
    { label: "First Name", value: user.firstName },
    { label: "Last Name", value: user.lastName },
    { label: "Emails", value: user.emailAddresses.map(email => email.emailAddress).join(", ") },
    { label: "Custom Name", value: user.unsafeMetadata.customName },
    { label: "Custom Bio", value: user.unsafeMetadata.customBio },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl mx-auto mt-6 px-4 py-6"
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <h1 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h1>
          </div>
        </div>
        <div className="p-6">
          {profileInfo.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4 pb-4 border-b border-gray-200 last:border-b-0"
            >
              <h2 className="text-sm font-semibold text-gray-600">{item.label}</h2>
              <p className="text-lg text-gray-800">{item.value || "Not provided"}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-center mt-6"
      >
        <Link href={'/settings/profile/edit'}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 px-6 py-3 rounded-full font-bold text-white transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Update Additional Information
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default ViewProfile