'use client'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CreditCard, LucideIcon } from 'lucide-react'
import React from 'react'

type Props = {
  value: string
  title: string
  text: string
  icon: LucideIcon
  portalContext: 'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO'
  setPortalContext: React.Dispatch<React.SetStateAction<'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO'>>
}

const ContextTypeBanner = ({
  text,
  title,
  icon: Icon,
  portalContext,
  setPortalContext,
  value,
}: Props) => {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          'w-full cursor-pointer mb-4 max-w-96 min-w-96', 
          portalContext === value && 'border-orange'
        )}
        onClick={() => setPortalContext(value)}
      >
        <CardContent className="flex flex-col justify-between p-4">
          <div className="flex items-center gap-3 mb-4">
            <Icon
              size={50}
              className={cn(
                'flex justify-center p-3',
                portalContext === value ? 'text-orange' : 'text-gray-400'
              )}
            />
            <div>
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
                portalContext === value ? 'bg-orange' : 'bg-transparent'
              )}
            >
              <Input
                onChange={() => setPortalContext(value)}
                checked={portalContext === value}
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

export default ContextTypeBanner
