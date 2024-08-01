import React from 'react'
import { ProgressBar } from './progress'

type PlanUsageProps = {
  plan: 'STANDARD' | 'PRO' | 'ULTIMATE'
  credits: number
  domains: number
  clients: number
}

export const PlanUsage = ({
  plan,
  credits,
  domains,
  clients,
}: PlanUsageProps) => {
  return (
    <div className="flex flex-col gap-5 py-5">
      <ProgressBar
        end={plan == 'STANDARD' ? 10 : plan == 'STANDARD' ? 50 : 500}
        label="Standard"
        credits={credits}
      />
      <ProgressBar
        end={plan == 'PRO' ? 1 : plan == 'PRO' ? 2 : 100}
        label="Pro"
        credits={domains}
      />
      <ProgressBar
        end={plan == 'ULTIMATE' ? 10 : plan == 'ULTIMATE' ? 50 : 500}
        label="Ultimate"
        credits={clients}
      />
    </div>
  )
}
