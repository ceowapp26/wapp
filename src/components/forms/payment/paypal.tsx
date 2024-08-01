'use client'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Billing } from 'lucide-react'
import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

type Props = {
  value: string
  title: string
  text: string
  register: UseFormRegister<FieldValues>
  paymentGateway: 'PAYPAL' | 'STRIPE'
  setPaymentGateway: React.Dispatch<React.SetStateAction<string>>
}

const PaymentGatewayBanner = ({
  register,
  setPaymentGateway,
  text,
  title,
  paymentGateway,
  value,
}: Props) => {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          'w-full cursor-pointer mb-4',
          paymentGateway === value && 'border-orange'
        )}
      >
        <CardContent className="flex flex-col justify-between p-4"> 
          <div className="flex items-center gap-3 mb-4">
            <Card
              className={cn(
                'flex justify-center p-3',
                paymentGateway === value && 'border-orange'
              )}
            >
              <Billing
                size={30}
                className={cn(
                  paymentGateway === value ? 'text-orange' : 'text-gray-400'
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
          <div className="self-end"> {/* Align the radio button to the end */}
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                paymentGateway === value ? 'bg-orange' : 'bg-transparent'
              )}
            >
              <Input
                {...register('type', {
                  onChange: (e) => {
                    setPaymentGateway(e.target.value)
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

export default PaymentGatewayBanner
