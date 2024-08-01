'use client'
import React from 'react'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'
import { FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useAuthContextHook } from '@/context/auth-context-provider'

type Props = {
  value: string
  title: string
  text: string
  register: UseFormRegister<FieldValues>
  userRole: 'individual' |'owner' | 'developer' | 'student'
  setUserRole: React.Dispatch<React.SetStateAction<'individual' |'owner' | 'developer' | 'student'>>
}

const UserRoleBanner = ({
  register,
  setUserRole,
  text,
  title,
  userRole,
  value,
}: Props) => {
  const { userType, setUserType } = useAuthContextHook();
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          'w-full cursor-pointer',
          userRole == value && 'border-orange'
        )}
      >
        <CardContent className="flex justify-between p-2">
          <div className="flex items-center gap-3">
            <Card
              className={cn(
                'flex justify-center p-3',
                userRole == value && 'border-orange'
              )}
            >
              <User
                size={30}
                className={cn(
                  userRole == value ? 'text-orange' : 'text-gray-400'
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
          <div>
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                userRole == value ? 'bg-orange' : 'bg-transparent'
              )}
            >
              <Input
                {...register('type', {
                  onChange: (e) => { 
                    setUserRole(e.target.value)
                    setUserType(e.target.value)
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

export default UserRoleBanner