"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { List, ListItem, ListItemAvatar, ListItemText, Button } from "@mui/material";

const defaultOption = {
  orgName: "Select Account",
  orgId: "",
};

const getRandomColor = () => {
  const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface OrganizationPopoverProps {
  documentId: Id<"documents">;
}

export const OrganizationPopover = ({ documentId }: OrganizationPopoverProps) => {
  const { user } = useUser();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const updateDocument = useMutation(api.documents.updateDocument);

  const handleSelect = (organization) => {
    updateDocument(documentId, {
      orgId: organization.id,
    });
    setActive({ organization: organization ? organization.id : null });
  };

  useEffect(() => {
    if (userMemberships && userMemberships.data) {
      const personalAccount = userMemberships.data.find((mem) => !mem.organization);
      if (personalAccount) {
        handleSelect(null);
      }
    }
  }, [userMemberships]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
      <>
        <div>Accounts</div>
        <List>
          {userMemberships?.data?.map((mem) => (
            <ListItem button key={mem.organization?.id} onClick={() => handleSelect(mem.organization)}>
              <ListItemAvatar>
                {mem.organization?.imageUrl ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mem.organization.imageUrl} />
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8">
                    <Building2 className={`h-8 w-8 ${getRandomColor()}`} />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText primary={mem.organization?.name} />
            </ListItem>
          ))}
        </List>
        {userMemberships.hasNextPage && (
          <Button onClick={() => userMemberships.fetchNext()}>
            Load more organizations
          </Button>
        )}
    </>
  );
};
