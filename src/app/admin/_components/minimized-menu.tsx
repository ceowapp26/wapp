import React from 'react'
import { SIDE_BAR_MENU } from '@/constants/menu'
import { TbHomeMove } from "react-icons/tb"
import { LogOut, Menu, SquareMenu, House } from 'lucide-react'
import { MenuLogo } from '@/icons/menu-logo'
import MenuItem from './menu-item'

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
  return (
    <div className="p-3 flex flex-col items-center h-full min-h-screen">
      <span className="animate-fade-in opacity-0 delay-300 fill-mode-forwards cursor-pointer">
        <MenuLogo onClick={onShrink} />
      </span>
      <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
        <div className="flex flex-col">
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem
              size="min"
              {...menu}
              key={key}
              current={current}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <MenuItem
            size="min"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
          />
          <MenuItem
            size="min"
            label="Back Home"
            icon={<TbHomeMove className="w-6 h-6" />}
            path={"home"}
          />
        </div>
      </div>
    </div>
  )
}

export default MinMenu;
