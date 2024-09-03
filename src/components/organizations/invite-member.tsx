"use client";

import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { OrganizationCustomRoleKey } from '@clerk/types';
import { UserPlus, Mail, UserCircle } from 'lucide-react';

const formStyles = `
  max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden
`;

const headerStyles = `
  bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-bold py-4 px-6
`;

const bodyStyles = `
  p-6
`;

const inputGroupStyles = `
  mb-4
`;

const labelStyles = `
  block text-gray-700 text-sm font-bold mb-2
`;

const inputStyles = `
  w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300
`;

const buttonStyles = `
  w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300
`;

export const InviteMember = () => {
  const { organization, invitations } = useOrganization();
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedRole, setSelectedRole] = useState<OrganizationCustomRoleKey | undefined>(undefined);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!emailAddress || !selectedRole || disabled) return;
    setDisabled(true);
    try {
      await organization?.inviteMember({ emailAddress, role: selectedRole });
      await invitations?.revalidate?.();
      setEmailAddress("");
      setSelectedRole(undefined);
    } catch (error) {
      console.error("Error inviting member:", error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className={formStyles}>
      <div className={headerStyles}>
        <UserPlus className="inline-block mr-2" /> Invite New Member
      </div>
      <form onSubmit={handleSubmit} className={bodyStyles}>
        <div className={inputGroupStyles}>
          <label className={labelStyles}>
            <Mail className="inline-block mr-2" /> Email Address
          </label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className={inputStyles}
            placeholder="Enter email address"
            required
          />
        </div>
        <div className={inputGroupStyles}>
          <label className={labelStyles}>
            <UserCircle className="inline-block mr-2" /> Role
          </label>
          <SelectRole
            fieldName="role"
            onChange={(e) => setSelectedRole(e.target.value as OrganizationCustomRoleKey)}
            value={selectedRole}
          />
        </div>
        <button type="submit" disabled={disabled} className={buttonStyles}>
          {disabled ? 'Inviting...' : 'Send Invitation'}
        </button>
      </form>
    </div>
  );
};

type SelectRoleProps = {
  fieldName?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  value?: OrganizationCustomRoleKey | undefined;
};

const SelectRole = ({ fieldName, onChange, value }: SelectRoleProps) => {
  const { organization } = useOrganization();
  const [roles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);

  useEffect(() => {
    if (!organization) return;
    organization.getRoles({
      pageSize: 20,
      initialPage: 1,
    }).then((res) => {
      setRoles(res.data.map(role => role.key as OrganizationCustomRoleKey));
    });
  }, [organization]);

  return (
    <select
      name={fieldName}
      onChange={onChange}
      value={value}
      className={inputStyles}
      required
    >
      <option value="">Select a role</option>
      {roles.map(role => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  );
};