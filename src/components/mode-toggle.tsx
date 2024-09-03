"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
  { name: "Light", icon: "🌞", value: "light" },
  { name: "Dark", icon: "🌙", value: "dark" },
  { name: "System", icon: "💻", value: "system" },
]

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className={`inline-flex h-[3em] items-center px-2 py-2 rounded-xl hover:bg-gray-500/10 dark:hover:bg-slate-700 transition-colors duration-200 text-black text-sm flex-shrink-0 border dark:hover:text-white dark:text-slate-100 dark:border-white border-black/20 transition-opacity`}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </div>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            align="end"
            as={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-40 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            {themes.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => setTheme(item.value)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between cursor-pointer transition-colors duration-150"
              >
                <span>{item.name}</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: theme === item.value ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                </motion.span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}