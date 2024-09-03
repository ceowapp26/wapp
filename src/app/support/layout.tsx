"use client"
import Sidebar from './_components/sidebar'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import Content from './_components/content'
import CustomNavbar from './_components/navbar'

export default function SupportLayout() {
  const [activeItem, setActiveItem] = useState('basic-navigation')

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomNavbar />
      <div className="flex">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
        />
        <main className="flex-1">
          <Content activeItem={activeItem} />
        </main>
      </div>
    </div>
  )
}
