"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Building2, User, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };

  if (!isLoaded) {
    return <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md" />;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100/50 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out">
        <span className="flex items-center">
          <Avatar className="w-6 h-6 mr-2 ring-2 ring-indigo-500 ring-offset-2">
            <AvatarImage src={activeOrg.orgLogo || user?.imageUrl} />
            <AvatarFallback>{activeOrg.orgName}</AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[120px]">{activeOrg.orgName}</span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 ml-2" />
        </motion.div>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            as={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-64 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <DropdownMenuLabel className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Accounts
            </DropdownMenuLabel>
            <DropdownMenuGroup className="max-h-60 overflow-y-auto">
              <DropdownMenuItem 
                onSelect={() => handleSelect(null)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer transition-colors duration-150 ease-in-out"
              >
                <Avatar className="w-8 h-8 mr-3 ring-2 ring-indigo-500 ring-offset-2">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <span className="flex-grow">Personal Account</span>
                {activeOrg.orgId === "" && <Check className="w-4 h-4 text-indigo-600" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              {memberships.map(({ id, organization }) => (
                <DropdownMenuItem 
                  key={id} 
                  onSelect={() => handleSelect(organization)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer transition-colors duration-150 ease-in-out"
                >
                  <Avatar className="w-8 h-8 mr-3 ring-2 ring-indigo-500 ring-offset-2">
                    <AvatarImage src={organization?.imageUrl} />
                    <AvatarFallback>
                      {organization?.name?.[0] || <Building2 className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-grow truncate">{organization?.name}</span>
                  {activeOrg.orgId === organization?.id && <Check className="w-4 h-4 text-indigo-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {userMemberships.hasNextPage && (
              <>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem 
                  onSelect={() => userMemberships.fetchNext()}
                  className="flex items-center justify-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors duration-150 ease-in-out"
                >
                  Load more organizations
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};