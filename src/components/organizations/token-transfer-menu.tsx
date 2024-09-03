"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useOrganizationList, useAuth, useUser } from "@clerk/nextjs";
import {
  ChevronDown,
  Building2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { Organization, ModelInterface, MemberInterface } from "@/types/note";
import { modelData, memberData } from "@/data"; // Assuming you have a data file for models and members

const defaultOption = {
  orgName: "Select Account",
  orgId: "",
};

const getRandomColor = () => {
  const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const TokenTransferMenu = () => {
  const { user } = useUser();
  const { selectedOrg, setSelectedOrg } = useMyspaceContext();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const { user: authUser } = useAuth();

  const [selectedModel, setSelectedModel] = useState<ModelInterface | null>(null);
  const [models, setModels] = useState<ModelInterface[]>(modelData);
  const [members, setMembers] = useState<MemberInterface[]>(memberData);

  useEffect(() => {
    setSelectedOrg(defaultOption);
  }, []);

  useEffect(() => {
    if (userMemberships.data) {
      const personalAccount = userMemberships.data.find((mem) => mem.organization === null);
      if (personalAccount) {
        setSelectedOrg({ orgName: "Personal Account", orgId: "" });
      }
    }
  }, [userMemberships.data]);

  const handleSelectOrg = (organization: Organization) => {
    setActive({ organization: organization ? organization.id : null });
    setSelectedOrg(organization ? { orgName: organization.name, orgId: organization.id, orgLogo: organization.imageUrl } : { orgName: "Personal Account", orgId: "" });
  };

  const handleSelectModel = (model: ModelInterface) => {
    setSelectedModel(model);
  };

  const handleTransferTokens = () => {
    // Implement your token transfer logic here
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="btn btn-primary">
            {selectedOrg.orgName} <ChevronDown className="ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Accounts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => handleSelectOrg(null)}>
                <div className="flex items-center gap-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                  </Avatar>
                  <p className="text-sm">Personal Account</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {userMemberships.data?.map((mem) => (
                <DropdownMenuItem key={mem.id} onSelect={() => handleSelectOrg(mem.organization)}>
                  <div className="flex items-center gap-x-2">
                    {mem.organization?.imageUrl ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mem.organization.imageUrl} />
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <Building2 className={`h-8 w-8 bg-transparent`} />
                      </Avatar>
                    )}
                    <p className="text-sm">{mem.organization?.name}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!userMemberships.hasNextPage} onSelect={() => userMemberships.fetchNext()}>
              Load more organizations
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="btn btn-primary">
            {selectedModel ? selectedModel.name : "Select Model"} <ChevronDown className="ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Models</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {models.map((model) => (
                <DropdownMenuItem key={model.id} onSelect={() => handleSelectModel(model)}>
                  <div className="flex items-center gap-x-2">
                    <p className="text-sm">{model.name}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold">Model Information</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Base RPM</th>
              <th>Base RPD</th>
              <th>Base TPM</th>
              <th>Base TPD</th>
              {/* Add other model columns here */}
            </tr>
          </thead>
          <tbody>
            {selectedModel && (
              <tr>
                <td>{selectedModel.name}</td>
                <td>{selectedModel.baseRPM}</td>
                <td>{selectedModel.baseRPD}</td>
                <td>{selectedModel.baseTPM}</td>
                <td>{selectedModel.baseTPD}</td>
                {/* Add other model data here */}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold">Organization Members</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Transferred Tokens</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>
                  <input type="number" className="input input-bordered" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary" onClick={handleTransferTokens}>
        TRANSFER
      </button>
    </div>
  );
};

export default TokenTransferMenu;
