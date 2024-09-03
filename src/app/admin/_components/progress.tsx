'use client'
import React from 'react'
import { Progress } from '@/components/ui/progress'

type ProgressBarProps = {
  label: string
  end: number
  credits: number
}

export const ProgressBar = ({ label, end, credits }: ProgressBarProps) => {
  return (
    <div className="flex flex-col w-full md:w-7/12 gap-1">
      <h2 className="font-bold dark:text-gray-500">{label}</h2>
      <div className="flex flex-col">
        <div className="flex justify-between text-sm dark:text-gray-700">
          <p>{credits}</p>
          <p>{end}</p>
        </div>
        <Progress
          value={(credits / end) * 100}
          className="w-full dark:text-gray-500"
        />
      </div>
    </div>
  )
}
