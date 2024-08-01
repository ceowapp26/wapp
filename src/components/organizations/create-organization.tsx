'use client';

import { useOrganizationList } from "@clerk/nextjs";
import { FormEventHandler, useState } from "react";
import {
  Form,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormSubmit,
} from "@/components/ui/radix-form";
import { Building2, FileText, PlusCircle } from 'lucide-react';

export const CreateOrganization = () => {
  const { createOrganization } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createOrganization({ name: organizationName });
    setOrganizationName("");
    setOrganizationDescription("");
  };

  return (
    <Form onSubmit={handleSubmit} className="w-[400px] h-full bg-white border border-gray-200 mt-12 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Organization</h2>
      <FormField className="mb-4" name="organization">
        <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Building2 className="w-4 h-4 mr-2 mb-1" />
          Organization Name
        </FormLabel>
        <FormControl asChild>
          <div>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              required
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Enter organization name"
            />
            <FormMessage className="text-xs text-red-500 mt-1" match="valueMissing">
              Please enter organization name
            </FormMessage>
          </div>
        </FormControl>
      </FormField>

      <FormField className="mb-4" name="description">
        <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <FileText className="w-4 h-4 mr-2 mb-1" />
          Description
        </FormLabel>
        <FormControl asChild>
          <div>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              required
              value={organizationDescription}
              onChange={(e) => setOrganizationDescription(e.target.value)}
              placeholder="Describe your organization"
              rows={4}
            />
            <FormMessage className="text-xs text-red-500 mt-1" match="valueMissing">
              Please describe your organization
            </FormMessage>
          </div>
        </FormControl>
      </FormField>
      <FormSubmit asChild>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Organization
        </button>
      </FormSubmit>
    </Form>
  )
};