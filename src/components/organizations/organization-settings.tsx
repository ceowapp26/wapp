"use client";
import React from 'react';
import { JoinedOrganizations } from './joined-organizations';
import { CreateOrganization } from './create-organization';
import { UpdateOrganization } from './update-organization';
import { InviteMember } from './invite-member';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

const OrganizationSettings = () => {
  const [selectedTab, setSelectedTab] = React.useState("organization-list");
  const [isVertical, setIsVertical] = React.useState(true);

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  return (
    <div className="flex flex-col pt-4 mt-4">
      <div className="flex flex-grow w-full">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          isVertical={true}
          aria-label="Organization Options"
          classNames={{
            tab: "justify-start",
          }}
        >
          <Tab value="organization-list" title="Organization Member">
            <Card>
              <CardBody className="flex items-center justify-center w-full min-w-[500px] max-h-[400px] overflow-y-auto">
                <JoinedOrganizations />
              </CardBody>
            </Card>
          </Tab>
          <Tab value="organization-create" title="Organization Create">
            <Card>
              <CardBody className="flex items-center justify-center w-full min-w-[500px] max-h-[400px] overflow-y-auto">
                <CreateOrganization />
              </CardBody>
            </Card>
          </Tab>
          <Tab value="organization-update" title="Organization Update">
            <Card>
              <CardBody className="flex items-center justify-center w-full min-w-[500px] max-h-[400px] overflow-y-auto">
                <UpdateOrganization />
              </CardBody>
            </Card>
          </Tab>
          <Tab value="organization-invite" title="Invite Member">
            <Card>
              <CardBody className="flex items-center justify-center w-full min-w-[500px] max-h-[400px] overflow-y-auto">
                <InviteMember />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default OrganizationSettings;
