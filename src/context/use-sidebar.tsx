'use client'
import React from 'react'
import { useToast } from '@/components/ui/use-toast'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useClerk } from '@clerk/nextjs'

const useSideBar = () => {
  const router = useRouter()
  const { signOut } = useClerk()
  const pathname = usePathname()
  const { toast } = useToast()
  const [expand, setExpand] = useState<boolean | undefined>(undefined)
  const page = pathname.split('/').pop()
  const onSignOut = () => signOut(() => router.push('/'))
  const onExpand = () => setExpand((prev) => !prev)

  return {
    expand,
    page,
    onExpand,
    onSignOut,
  }
}

export default useSideBar
