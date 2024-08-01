import React from 'react'
import { SIDE_BAR_MENU } from '@/constants/menu'
import { TbHomeMove } from "react-icons/tb"
import { LogOut, Menu, SquareMenu } from 'lucide-react'
import Image from 'next/image'
import MenuItem from './menu-item'
import { usePathname } from 'next/navigation'

type Props = {
  onExpand(): void
  current: string
  onSignOut(): void
}

const MaxMenu = ({ current, onExpand, onSignOut }: Props) => {
  return (
    <div className="py-3 px-4 flex flex-col h-full min-h-screen">
      <div className="flex justify-between items-center">
        <Image
          src="/global/company_logos/wapp-logo.png"
          alt="LOGO"
          className="animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          width={40}
          height={40}
        />
        <Menu
          className="cursor-pointer animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          onClick={onExpand}
        />
      </div>
      <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
        <div className="flex flex-col">
          <p className="text-md text-gray-500 mb-3 font-bold">MENU</p>
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem
              size="max"
              {...menu}
              key={key}
              current={current}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <MenuItem
            size="max"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
          />
          <MenuItem
            size="max"
            label="Back Home"
            path={"home"}
            icon={<TbHomeMove className="w-6 h-6" />}
          />
        </div>
      </div>
    </div>
  )
}

export default MaxMenu
