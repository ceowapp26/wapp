'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStoreUser } from "@/hooks/use-store-user";
import { motion } from 'framer-motion';
import { FaUsers, FaStar } from 'react-icons/fa';

const HeroSection = () => {
    const { isLoading, isAuthenticated, role } = useStoreUser();
    
    const redirectRoute = isAuthenticated 
        ? (role === 'admin' ? '/admin' : '/home')
        : '/auth/sign-in';

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center rounded-b-3xl overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 mb-10 lg:mb-0 text-white"
                    >
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight"
                        >
                            Unleash Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Potential</span> with WAPP
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8"
                        >
                            Experience the power of our all-in-one platform. Boost productivity, streamline workflows, and achieve more with WAPP.
                        </motion.p>
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8"
                        >
                            <Link href={redirectRoute}>
                                <motion.button 
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(129, 140, 248, 0.6)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg transition duration-300 ease-in-out shadow-lg"
                                >
                                    {isAuthenticated ? 'Launch WAPP' : 'Get Started Free'}
                                </motion.button>
                            </Link>
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto bg-transparent text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg transition duration-300 ease-in-out border-2 border-white hover:bg-white hover:text-indigo-900"
                            >
                                Watch Demo
                            </motion.button>
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8 space-y-4 sm:space-y-0"
                        >
                            <div className="flex items-center">
                                <FaUsers className="text-2xl sm:text-3xl text-indigo-400 mr-2" />
                                <span className="text-xl sm:text-2xl font-bold">100K+</span>
                                <span className="ml-2 text-gray-300 text-sm sm:text-base">Users</span>
                            </div>
                            <div className="flex items-center">
                                <FaStar className="text-2xl sm:text-3xl text-yellow-400 mr-2" />
                                <span className="text-xl sm:text-2xl font-bold">4.9</span>
                                <span className="ml-2 text-gray-300 text-sm sm:text-base">Rating</span>
                            </div>
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full lg:w-1/2 mt-10 lg:mt-0"
                    >
                        <div className="relative">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-1 shadow-2xl"
                            >
                                <Image 
                                    src="/global/images/hero/hero-background.jpg" 
                                    alt="WAPP Platform" 
                                    width={600} 
                                    height={400}
                                    className="rounded-xl w-full h-auto"
                                    layout="responsive"
                                />
                            </motion.div>
                            <div className="absolute -bottom-4 sm:-bottom-10 -left-4 sm:-left-10 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                <span className="text-indigo-900 font-bold text-lg sm:text-xl">New!</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.92,150.07,105.6,221.79,85.37Z" fill="rgba(255, 255, 255, 0.05)"></path>
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;