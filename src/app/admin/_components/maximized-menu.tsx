import React, { useState } from 'react'
import { SIDE_BAR_MENU } from '@/constants/menu'
import { LogOut, Menu, ChevronLeft, Warehouse } from 'lucide-react'
import Image from 'next/image'
import MenuItem from './menu-item'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

type Props = {
  onExpand(): void
  current: string
  onSignOut(): void
}

const MaxMenu = ({ current, onExpand, onSignOut }: Props) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="py-6 px-4 flex flex-col h-full min-h-screen bg-gray-100 dark:bg-gray-900 shadow-lg"
    >
      <div className="flex justify-between items-center mb-10 ml-1">
        <Image
          src="/global/company_logos/wapp-logo.png"
          alt="LOGO"
          width={50}
          height={50}
          className="transition-transform duration-300 hover:scale-110"
        />
        <Menu
          className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300"
          size={28}
          onClick={onExpand}
        />
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col">
          <p className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-4 ml-3 font-bold tracking-wider">Menu</p>
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem
              key={key}
              size="max"
              {...menu}
              current={current}
              isHovered={hoveredItem === menu.path}
              onHover={() => setHoveredItem(menu.path)}
              onLeave={() => setHoveredItem(null)}
            />
          ))}
        </div>
        <div className="flex flex-col mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <MenuItem
            size="max"
            label="Back Home"
            path="home"
            icon={<Warehouse />}
            isHovered={hoveredItem === 'home'}
            onHover={() => setHoveredItem('home')}
            onLeave={() => setHoveredItem(null)}
          />
          <MenuItem
            size="max"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
            isHovered={hoveredItem === 'signout'}
            onHover={() => setHoveredItem('signout')}
            onLeave={() => setHoveredItem(null)}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default MaxMenu
