"use client"

import Content from './_components/content'
import { useState } from 'react'

export default function SupportPage() {
  const [activeItem, setActiveItem] = useState('Account Setup')

  return (
    <Content activeItem={activeItem} />
  )
}

