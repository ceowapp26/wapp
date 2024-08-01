'use client'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CreditCard } from 'lucide-react'
import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

type Props = {
  value: string
  title: string
  text: string
  register: UseFormRegister<FieldValues>
  modelType: 'SUBSCRIPTION' | 'CREDIT'
  setModelType: React.Dispatch<React.SetStateAction<'SUBSCRIPTION' | 'CREDIT'>>
}

const ModelTypeBanner = ({
  register,
  text,
  title,
  modelType,
  setModelType,
  value,
}: Props) => {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          'w-full cursor-pointer mb-4', 
          modelType === value && 'border-orange'
        )}
      >
        <CardContent className="flex flex-col justify-between p-4">
          <div className="flex items-center gap-3 mb-4">
            <Card
              className={cn(
                'flex justify-center p-3',
                modelType === value && 'border-orange'
              )}
            >
              <CreditCard
                size={30}
                className={cn(
                  modelType === value ? 'text-orange' : 'text-gray-400'
                )}
              />
            </Card>
            <div className="">
              <CardDescription className="text-iridium">
                {title}
              </CardDescription>
              <CardDescription className="text-gray-400">
                {text}
              </CardDescription>
            </div>
          </div>
          <div className="self-end">
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                modelType === value ? 'bg-orange' : 'bg-transparent'
              )}
            >
              <Input
                {...register('type', {
                  onChange: (e) => {
                    setModelType(e.target.value)
                  }
                })}
                value={value}
                id={value}
                className="hidden"
                type="radio"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Label>
  )
}

export default ModelTypeBanner
