"use client";
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/hooks/hooks';
import { selectLibraryBooks } from '@/stores/features/apps/book/libraryBooksSlice';
import MyFavoriteTabContent from './tabs/MyFavorite';
import ReadingNowTabContent from './tabs/ReadingNow';
import ToReadTabContent from './tabs/ToRead';
import HaveReadTabContent from './tabs/HaveRead';
import TabContentContainer from './TabContentContainer';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { FaHeart, FaBookOpen, FaList, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from 'next-themes';

const TabsContainer = () => {
    const books = useAppSelector(selectLibraryBooks);
    const { tabIndex, setTabIndex, isAppbarCollapsed } = useMyspaceContext();
    const { theme } = useTheme();

    const tabData = [
        { label: 'My Favorite', icon: <FaHeart />, content: MyFavoriteTabContent, prop: 'myfavorite' },
        { label: 'Reading Now', icon: <FaBookOpen />, content: ReadingNowTabContent, prop: 'readingnow' },
        { label: 'To Read', icon: <FaList />, content: ToReadTabContent, prop: 'toread' },
        { label: 'Have Read', icon: <FaCheckCircle />, content: HaveReadTabContent, prop: 'haveread' },
    ];

    return (
        <Tabs
            className={`p-6 md:p-10 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
        >
            <TabList className="flex flex-wrap mb-6 border-b border-gray-300 dark:border-gray-600">
                {tabData.map((tab, index) => (
                    <Tab
                        key={index}
                        className={`flex items-center px-4 py-2 mr-2 mb-2 cursor-pointer transition-all duration-300 ease-in-out
                            ${tabIndex === index ? 'border-b-2 border-blue-500' : ''}
                            hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg`}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center"
                        >
                            {tab.icon}
                            <span className="ml-2">{tab.label}</span>
                        </motion.div>
                    </Tab>
                ))}
            </TabList>
            <AnimatePresence mode="wait">
                {tabData.map((tab, index) => (
                    <TabPanel key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {books[tab.prop] ? (
                                <TabContentContainer entities={books[tab.prop]}>
                                    <tab.content {...{ [tab.prop]: books[tab.prop] }} />
                                </TabContentContainer>
                            ) : (
                                <div className="text-center py-4">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="inline-block w-8 h-8 border-t-2 border-blue-500 rounded-full"
                                    />
                                    <p className="mt-2">Loading...</p>
                                </div>
                            )}
                        </motion.div>
                    </TabPanel>
                ))}
            </AnimatePresence>
        </Tabs>
    );
};

export default TabsContainer;

