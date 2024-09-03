import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
  size: 'max' | 'min'
  label: string
  icon: JSX.Element
  path?: string
  current?: string
  onSignOut?(): void
  isHovered?: boolean
  onHover?(): void
  onLeave?(): void
}

const MenuItem = ({ size, path, icon, label, current, onSignOut, isHovered, onHover, onLeave }: Props) => {
  const commonClasses = 'flex items-center gap-3 px-3 py-3 rounded-lg my-1 transition-all duration-300 ease-in-out'
  const activeClasses = 'bg-blue-500 text-white font-semibold shadow-md'
  const inactiveClasses = 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'

  const content = (
    <>
      <motion.span
        initial={{ scale: 1 }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.span>
      {size === 'max' && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {label}
        </motion.span>
      )}
    </>
  )

  if (size === 'min') {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          onClick={onSignOut}
          className={cn(
            commonClasses,
            current === path ? activeClasses : inactiveClasses,
            'justify-center'
          )}
          href={path ? `/${path}` : '#'}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        onClick={onSignOut}
        className={cn(
          commonClasses,
          current === path ? activeClasses : inactiveClasses
        )}
        href={path ? `/${path}` : '#'}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {content}
      </Link>
    </motion.div>
  )
}

export default MenuItem
