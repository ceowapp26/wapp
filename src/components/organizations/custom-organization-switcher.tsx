"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useEffect, useMemo } from "react";
import { ChevronDown, Building2, User } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { Organization } from "@/types/note";

const DEFAULT_OPTION = {
  orgName: "Select Account",
  orgId: "",
};

const PERSONAL_ACCOUNT = {
  orgName: "Personal Account",
  orgId: "",
};

export const CustomOrganizationSwitcher = () => {
  const { user } = useUser();
  const { activeOrg, setActiveOrg } = useMyspaceContext();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const memberships = userMemberships.data ?? [];

  const personalAccount = useMemo(() => 
    memberships.find(mem => mem.organization === null),
    [memberships]
  );

  useEffect(() => {
    setActiveOrg(personalAccount ? PERSONAL_ACCOUNT : DEFAULT_OPTION);
  }, [personalAccount, setActiveOrg]);

  const handleSelect = (organization: Organization | null) => {
    setActive({ organization: organization?.id ?? null });
    setActiveOrg(organization 
      ? { orgName: organization.name, orgId: organization.id, orgLogo: organization.imageUrl }
      : PERSONAL_ACCOUNT
    );
  };

  if (!isLoaded) {
    return <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-md" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <span className="flex items-center">
          <Avatar className="w-5 h-5 mr-2">
            <AvatarImage src={activeOrg.orgLogo || user?.imageUrl} />
            <AvatarFallback>{activeOrg.orgName}</AvatarFallback>
          </Avatar>
          {activeOrg.orgName}
        </span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <DropdownMenuLabel className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
          Accounts
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuGroup className="max-h-60 overflow-y-auto">
          <DropdownMenuItem 
            onSelect={() => handleSelect(null)}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <Avatar className="w-6 h-6 mr-3">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
            </Avatar>
            Personal Account
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          {memberships.map(({ id, organization }) => (
            <DropdownMenuItem 
              key={id} 
              onSelect={() => handleSelect(organization)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Avatar className="w-6 h-6 mr-3">
                <AvatarImage src={organization?.imageUrl} />
                <AvatarFallback>
                  {organization?.name?.[0] || <Building2 className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              {organization?.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {userMemberships.hasNextPage && (
          <>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem 
              onSelect={() => userMemberships.fetchNext()}
              className="flex items-center justify-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 cursor-pointer"
            >
              Load more organizations
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};