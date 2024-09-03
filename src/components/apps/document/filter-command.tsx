"use client";

import { useEffect, useState } from "react";
import { File, Search, X, ChevronDown } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from "@/components/ui/select";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { useFilter } from "@/hooks/use-filter";
import { api } from "@/convex/_generated/api";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <CommandDialog open={isOpen} onOpenChange={onClose} className="max-w-3xl">
      <div className="flex items-center p-4 border-b mt-6">
        <Search className="w-5 h-5 text-muted-foreground mr-2" />
        <CommandInput
          placeholder="Search documents..."
          className="flex-1 bg-transparent border-none focus:outline-none"
        />
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[200px] border-none">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="per" className="py-2">
              <div className="flex items-center">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName}</AvatarFallback>
                </Avatar>
                Personal Account
              </div>
            </SelectItem>
            <SelectSeparator />
            {isLoaded && userMemberships?.data && (
              <SelectGroup>
                <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Organizations
                </SelectLabel>
                {userMemberships.data.map(({ id, organization }) => (
                  <SelectItem key={id} value={organization.id} className="py-2">
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarImage src={organization.imageUrl} />
                        <AvatarFallback>{organization.name[0]}</AvatarFallback>
                      </Avatar>
                      {organization.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[400px]">
        <CommandList>
          {(!filteredDocuments || filteredDocuments.length === 0) && (
            <CommandEmpty>No documents found.</CommandEmpty>
          )}
          {filteredDocuments && filteredDocuments.length > 0 && (
            <CommandGroup heading="Documents">
              {filteredDocuments.map((document) => (
                <CommandItem
                  key={document._id}
                  value={`${document._id}-${document.title}`}
                  onSelect={() => onSelect(document._id)}
                  className="py-3 px-4 cursor-pointer hover:bg-accent"
                >
                  <div className="flex items-center">
                    {document.icon ? (
                      <span className="text-2xl mr-3">{document.icon}</span>
                    ) : (
                      <File className="w-5 h-5 mr-3 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate">{document.title}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </ScrollArea>
      <div className="flex justify-end p-4 border-t">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </CommandDialog>
  );
};