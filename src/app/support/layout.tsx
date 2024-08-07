"use client"
import Sidebar from './_components/sidebar'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import Content from './_components/content'
import CustomNavbar from './_components/navbar'

export default function SupportLayout() {
  const [activeItem, setActiveItem] = useState('Account Setup')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomNavbar setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
        />
        <main className="flex-1">
          <Content activeItem={activeItem} />
        </main>
      </div>
    </div>
  )
}
