import React, { useState } from "react";
import { Home, Settings, HelpCircle, Users, Mail, X, ChevronRight, ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    key: "getting-started",
    label: "Getting Started",
    icon: <Home className="w-5 h-5" />,
    children: [
      { key: "basic-navigation", label: "Basic Navigation" },
      { key: "document", label: "Document" },
      { key: "video", label: "Video" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { key: "profile-settings", label: "Profile Settings" },
      { key: "ai-settings", label: "AI Settings" },
      { key: "chatbot-settings", label: "Chatbot Settings" },
      { key: "wapp-settings", label: "WApp Settings" },
    ],
  },
  {
    key: "forum",
    label: "Forum",
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    key: "community",
    label: "Community",
    icon: <Users className="w-5 h-5" />,
  },
  {
    key: "contact",
    label: "Contact Support",
    icon: <Mail className="w-5 h-5" />,
  },
];

const MenuItem = ({ item, level, activeItem, setActiveItem, expandedItems, toggleExpand }) => {
  const isExpanded = expandedItems[item.key];
  const isActive = activeItem === item.key;

  return (
    <>
      <div
        className={`flex items-center justify-between py-2 px-4 my-1 rounded-lg transition-all duration-200 cursor-pointer ${
          isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
        onClick={() => setActiveItem(item.key)}
      >
        <div className="flex items-center">
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </div>
        {item.children && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(item.key);
            }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>
      {item.children && isExpanded && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {item.children.map((child) => (
              <MenuItem
                key={child.key}
                item={child}
                level={level + 1}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                expandedItems={expandedItems}
                toggleExpand={toggleExpand}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default function Sidebar({ activeItem, setActiveItem }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [isOpen, setIsOpen] = useState(true);

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => setIsOpen(true)}
            className="fixed top-20 left-2 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 min-h-screen"
          >
            <Menu size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 h-screen bg-white shadow-2xl z-40 overflow-y-auto transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} pt-16 sm:pt-0 sm:w-64 sm:relative sm:translate-x-0`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-xl text-blue-600">Menu</h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200"
          >
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="p-2 text-gray-700">
          {items.map((item) => (
            <MenuItem
              key={item.key}
              item={item}
              level={0}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}