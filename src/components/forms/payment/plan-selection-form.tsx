import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import PlanTypeBanner from './plan-type-banner'
import ButtonHandler from './button-handlers'

type Props = {
  register: UseFormRegister<FieldValues>
  planType: 'STANDARD' | 'PRO' | 'ULTIMATE'
  setPlanType: React.Dispatch<React.SetStateAction<'STANDARD' | 'PRO' | 'ULTIMATE'>>
}

const PlanSelectionForm = ({ register, setPlanType, planType }: Props) => {
  return (
    <>
      <h2 className="text-gravel md:text-4xl font-bold py-2">PLAN SUBSCRIPTION</h2>
      <p className="text-iridium md:text-sm">
        Choose the subscription plan for the best
        <br /> experience so it best suits you.
      </p>
      <PlanTypeBanner
        register={register}
        setPlanType={setPlanType}
        planType={planType}
        value="STANDARD"
        title="Register to be STANDARD user"
        text="Looking to learn more about wapp."
      />
      <PlanTypeBanner
        register={register}
        setPlanType={setPlanType}
        planType={planType}
        value="PRO"
        title="Register to be PRO user"
        text="Looking to learn more about wapp."
      />
      <PlanTypeBanner
        register={register}
        setPlanType={setPlanType}
        planType={planType}
        value="ULTIMATE"
        title="Register to be ULTIMATE user"
        text="Setting up account for my company."
      />
      <ButtonHandler />
    </>
  )
}

export default PlanSelectionForm
