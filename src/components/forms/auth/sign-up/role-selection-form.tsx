"use client"
import React from 'react'
import { FieldValues, UseFormRegister, UseFormSetValue, UseFormGetValues, UseFormWatch } from 'react-hook-form'
import UserRoleBanner from './user-role-banner'
import ButtonHandler from './button-handlers'

type Props = {
  register: UseFormRegister<FieldValues>
  userRole: 'individual' |'owner' | 'developer' | 'student'
  setUserRole: React.Dispatch<React.SetStateAction<'individual' |'owner' | 'developer' | 'student'>>
}

const RoleSelectionForm = ({ register, setUserRole, userRole }: Props) => {
  return (
    <React.Fragment>
      <h2 className="text-gravel md:text-4xl font-bold">Create an account</h2>
      <p className="text-iridium md:text-sm">
        Tell us about yourself! What do you do? Let’s tailor your
        <br /> experience so it best suits you.
      </p>
      <UserRoleBanner
        register={register}
        setUserRole={setUserRole}
        userRole={userRole}
        value="individual"
        title="Im am an individual user."
        text="Looking to learn more about wapp."
      />
      <UserRoleBanner
        register={register}
        setUserRole={setUserRole}
        userRole={userRole}
        value="owner"
        title="Im am a business owner."
        text="Setting up account for my company."
      />
      <UserRoleBanner
        register={register}
        setUserRole={setUserRole}
        userRole={userRole}
        value="developer"
        title="I am a developer"
        text="Looking to collaborate."
      />
      <UserRoleBanner
        register={register}
        setUserRole={setUserRole}
        userRole={userRole}
        value="student"
        title="Im a student"
        text="Looking to study."
      />
      <ButtonHandler />
    </React.Fragment>
  )
}

export default RoleSelectionForm