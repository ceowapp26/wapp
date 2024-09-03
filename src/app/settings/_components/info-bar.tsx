'use client'
import React from 'react'
import BreadCrumb from './bread-crumb'
import { Card } from '@/components/ui/card'
import { UserButton } from '@clerk/clerk-react'

type Props = {}

const InfoBar = (props: Props) => {
  return (
    <div className="flex w-full justify-between items-center py-4 mb-8 px-6 ">
      <BreadCrumb />
    </div>
  )
}

export default InfoBar
