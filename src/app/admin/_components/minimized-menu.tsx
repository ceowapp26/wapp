import React, { useState } from 'react'
import { SIDE_BAR_MENU } from '@/constants/menu'
import { LogOut, ChevronRight, Warehouse } from 'lucide-react'
import { MenuLogo } from '@/icons/menu-logo'
import MenuItem from './menu-item'
import { motion } from 'framer-motion'

type MinMenuProps = {
  onShrink(): void
  current: string
  onSignOut(): void
}

const MinMenu = ({
  onShrink,
  current,
  onSignOut,
}: MinMenuProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <motion.div 
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 'auto' }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 flex flex-col items-center h-full min-h-screen bg-gray-100 dark:bg-gray-900 shadow-lg"
    >
      <div className="mb-10 flex items-center justify-center">
        <motion.span
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="cursor-pointer"
        >
          <MenuLogo onClick={onShrink} />
        </motion.span>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col space-y-4">
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem
              key={key}
              size="min"
              {...menu}
              current={current}
              isHovered={hoveredItem === menu.path}
              onHover={() => setHoveredItem(menu.path)}
              onLeave={() => setHoveredItem(null)}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-4 mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <MenuItem
            size="min"
            label="Back Home"
            icon={<Warehouse />}
            path="home"
            isHovered={hoveredItem === 'home'}
            onHover={() => setHoveredItem('home')}
            onLeave={() => setHoveredItem(null)}
          />
          <MenuItem
            size="min"
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

export default MinMenu
