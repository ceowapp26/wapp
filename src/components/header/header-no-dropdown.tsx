import React from "react";
import { NavbarContent, NavbarItem, Link, Tooltip } from "@nextui-org/react";
import { NavbarItemsNoDropdown } from "@/constants/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function HeaderNoDropdown() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <NavbarContent className="flex flex-wrap justify-center gap-6 max-lg:mb-1 h-full">
      <AnimatePresence>
        {NavbarItemsNoDropdown.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavbarItem>
              <Tooltip content={item.description} className="max-w-48 text-wrap" placement="bottom">
                <Link
                  href={item.href}
                  as={motion.a}
                  className={`relative text-sm font-medium py-2 px-1 transition-colors duration-200 ${
                    router.pathname === item.href
                      ? 'text-primary'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {router.pathname === item.href && (
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="underline"
                      initial={false}
                    />
                  )}
                </Link>
              </Tooltip>
            </NavbarItem>
          </motion.div>
        ))}
      </AnimatePresence>
    </NavbarContent>
  );
}