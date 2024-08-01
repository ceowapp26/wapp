'use client';

import { useState, useEffect, FormEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@clerk/nextjs';
import {
  Form,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormSubmit,
} from "@/components/ui/radix-form";
import { Building2, Save } from 'lucide-react';

export const UpdateOrganization = () => {
  const [name, setName] = useState('');
  const router = useRouter();
  const { organization } = useOrganization();

  useEffect(() => {
    if (!organization) return;
    setName(organization.name);
  }, [organization]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await organization.update({ name });
      router.push(`/organizations/${organization.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="w-[400px] bg-white border border-gray-200 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Organization</h2>
      
      <FormField className="mb-6" name="organization">
        <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Building2 className="w-5 h-5 mr-2 text-blue-500" />
          Organization Name
        </FormLabel>
        <FormControl asChild>
          <div>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new organization name"
            />
            <FormMessage className="mt-2 text-sm text-red-600" match="valueMissing">
              Please enter the organization name
            </FormMessage>
          </div>
        </FormControl>
      </FormField>

      <FormSubmit asChild>
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center justify-center">
          <Save className="w-5 h-5 mr-2" />
          Update Organization
        </button>
      </FormSubmit>
    </Form>
  );
};