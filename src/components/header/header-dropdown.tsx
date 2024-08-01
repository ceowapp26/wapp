import React, { useState } from "react";
import { NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { NavbarItemsDropdown } from "@/constants/navbar";
import { ChevronDown, ChevronUp, Lock, Activity, Flash, Server, TagUser, Scale } from "@/icons/navbar-icon";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function HeaderDropdown() {
  const { theme } = useTheme();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const icons = {
    chevronDown: <ChevronDown fill="currentColor" size={16} />,
    chevronUp: <ChevronUp fill="currentColor" size={16} />,
    autoscaling: <Scale className="text-warning" fill="currentColor" size={30} />,
    usageMetrics: <Activity className="text-secondary" fill="currentColor" size={30} />,
    productionReady: <Flash className="text-primary" fill="currentColor" size={30} />,
    uptime: <Server className="text-success" fill="currentColor" size={30} />,
    support: <TagUser className="text-danger" fill="currentColor" size={30} />,
    security: <Lock className="text-success" fill="currentColor" size={30} />,
  };

  const handleToggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <NavbarContent className="flex flex-wrap justify-center gap-4" justify="center">
      {Object.keys(NavbarItemsDropdown).map((label, index) => (
        <NavbarItem key={index} className="relative">
          <Button
            disableRipple
            className={`p-2 transition-all duration-200 hover:scale-105 ${
              theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'
            }`}
            endContent={
              <motion.div
                animate={{ rotate: openMenuIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {icons.chevronDown}
              </motion.div>
            }
            onClick={() => handleToggleMenu(index)}
            radius="sm"
            variant="light"
          >
            {label}
          </Button>
          <AnimatePresence>
            {openMenuIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-full left-0 w-[340px] backdrop-blur-md border rounded-lg shadow-lg mt-2 z-50 ${
                  theme === 'dark'
                    ? 'bg-gray-800/90 border-gray-700 text-white'
                    : 'bg-white/90 border-gray-200 text-gray-800'
                }`}
              >
                {NavbarItemsDropdown[label].map((item, itemIndex) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-4 p-3 transition-colors duration-200 ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="p-2 rounded-full bg-gradient-to-br from-primary to-secondary">
                        {icons[item.icon]}
                      </div>
                      <div>
                        <span className="font-semibold block">{item.label}</span>
                        <span className={`text-sm text-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </NavbarItem>
      ))}
    </NavbarContent>
  );
}
