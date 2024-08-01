'use client'
import React from 'react'
import BreadCrumb from './bread-crumb'
import { Card } from '@/components/ui/card'
import { UserButton } from '@clerk/clerk-react'

type Props = {}

const InfoBar = (props: Props) => {
  return (
    <div className="flex w-full justify-between items-center py-1 mb-8 ">
      <BreadCrumb />
      <div className="flex gap-3 items-center">
        <div>
          <UserButton userProfileUrl="/profile/view" />
        </div>
      </div>
    </div>
  )
}

export default InfoBar
