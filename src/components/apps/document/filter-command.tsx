"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useOrganizationList, useAuth, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup, 
  SelectSeparator
} from "@/components/ui/select";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";

import { useFilter } from "@/hooks/use-filter";
import { api } from "@/convex/_generated/api";
import { useMyspaceContext } from "@/context/myspace-context-provider";

export const FilterCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const { selectedOrg } = useMyspaceContext();
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [value, setValue] = useState("per");
  const [isMounted, setIsMounted] = useState(false);
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const cloudDocuments = useQuery(
    api.documents.getDocumentsByOrgId,
    value === "per" ? {} : { orgId: value }
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (cloudDocuments) {
      setFilteredDocuments(cloudDocuments);
    }
  }, [cloudDocuments]);

  const toggle = useFilter((store) => store.toggle);
  const isOpen = useFilter((store) => store.isOpen);
  const onClose = useFilter((store) => store.onClose);

  const onSelect = (id) => {
    router.push(`/myspace/apps/document/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[3/4] px-4 mt-14 focus:ring-0 mx-4">
          <SelectValue placeholder="Select an option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="per">My Personal Account</SelectItem>
          <SelectSeparator className="h-[1px] bg-violet6 m-[5px]" />
          {isLoaded && userMemberships && (
            <SelectGroup>
              <SelectLabel>My Organization</SelectLabel>
              {userMemberships?.data.map((mem) => (
                <SelectItem key={mem.organization.id} value={mem.organization.id}>
                  {mem.organization.name}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      <CommandList className="h-full min-h-[300px] max-h-[500px] overflow-y-auto">
        {(!filteredDocuments || filteredDocuments.length === 0) && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {filteredDocuments && filteredDocuments.length > 0 && (
          <CommandGroup heading="Documents">
            {filteredDocuments.map((document) => (
              <CommandItem
                key={document._id}
                value={`${document._id}-${document.title}`}
                title={document.title}
                onSelect={() => onSelect(document._id)}
              >
                {document.icon ? (
                  <p className="mr-2 text-[18px]">{document.icon}</p>
                ) : (
                  <File className="mr-2 h-4 w-4" />
                )}
                <span>{document.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
