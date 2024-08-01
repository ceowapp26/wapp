'use client'
import React from 'react'
import useSideBar from '@/context/use-sidebar'
import MaxMenu from './maximized-menu'
import MinMenu from './minimized-menu'
import { cn } from '@/lib/utils'
import { useMediaQuery } from "usehooks-ts"

const SideBar = () => {
  const { expand, page, onExpand, onSignOut } = useSideBar()
  const isMobile = useMediaQuery("(max-width: 480px)")
  const isMediumScreen = useMediaQuery("(min-width: 768px)")

  return (
    <div
      className={cn(
        'bg-cream dark:bg-neutral-950 h-screen w-[60px] z-[100] min-h-[100vh] fill-mode-forwards fixed md:relative',
        expand == undefined && '',
        expand == true && (isMobile ? 'animate-open-full-sidebar' : 'animate-open-sidebar'),
        expand == false && 'animate-close-sidebar'
      )}
    >
      {expand ? (
        <MaxMenu
          current={page!}
          onExpand={onExpand}
          onSignOut={onSignOut}
        />
      ) : (
        <MinMenu
          current={page!}
          onShrink={onExpand}
          onSignOut={onSignOut}
        />
      )}
    </div>
  )
}

export default SideBar
