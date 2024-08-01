"use client";
import React from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button } from "@nextui-org/react";
import { Organization } from "@/types/note";
import { Building2, ChevronDown } from "lucide-react";

interface OrganizationListProps {
  selectedOrg: Organization;
  setSelectedOrg: React.Dispatch<React.SetStateAction<Organization>>;
}

export const OrganizationList = ({ selectedOrg, setSelectedOrg }: OrganizationListProps) => {
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const handleFetchNext = () => {
    userMemberships.fetchNext();
  };

  const handleSelect = (organization) => {
    setSelectedOrg(organization ? { 
      orgName: organization.name, 
      orgId: organization.id, 
      orgLogo: organization.imageUrl 
    } : { 
      orgName: "Personal Account", 
      orgId: "" 
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
          className="flex items-center max-w-xs text-gray-350/80 h-14 gap-2 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border border-gray-300 dark:border-gray-700"
        >
          {selectedOrg ? (
            <div className="flex items-center gap-x-3 text-white">
              <Avatar
                size="sm"
                src={selectedOrg.orgLogo}
                alt={selectedOrg.orgName}
              />
              <span className="text-sm font-medium">{selectedOrg.orgName}</span>
            </div>
          ) : (
            "Select Organization"
          )}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Organizations"
        className="w-48 max-h-80 overflow-y-auto"
        onAction={(key) => {
          if (key === "load-more") {
            handleFetchNext();
          } else {
            const org = userMemberships.data.find(mem => mem.id === key)?.organization;
            handleSelect(org);
          }
        }}
      >
        <DropdownItem key="header" className="font-semibold text-lg opacity-70" isReadOnly>
          Accounts
        </DropdownItem>
        {userMemberships.data?.map((mem) => (
          <DropdownItem key={mem.id} className="py-2">
            <div className="flex items-center gap-x-3">
              <Avatar
                size="sm"
                src={mem.organization?.imageUrl}
                fallback={<Building2 className="h-6 w-6 text-gray-400" />}
                alt={mem.organization?.name}
              />
              <span className="text-sm font-medium">{mem.organization?.name}</span>
            </div>
          </DropdownItem>
        ))}
        {userMemberships.hasNextPage && (
          <DropdownItem key="load-more" className="text-primary">
            Load more organizations
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};