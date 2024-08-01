import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tab,
  Tabs,
  Card,
  CardBody,
} from "@nextui-org/react";
import { FiUsers, FiFolder, FiMessageSquare, FiFile } from "react-icons/fi";

const OrganizationManagement = () => {
  const [selectedTab, setSelectedTab] = React.useState("management");

  const renderManagementContent = () => (
    <Tabs>
      <Tab key="chats" title={<div className="flex items-center"><FiMessageSquare className="mr-2" />Chats</div>}>
        <Card>
          <CardBody>
            <Table aria-label="Chats table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>PARTICIPANTS</TableColumn>
                <TableColumn>LAST ACTIVE</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>Project Alpha</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>2 hours ago</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>Team Brainstorm</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>1 day ago</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </Tab>
      <Tab key="documents" title={<div className="flex items-center"><FiFile className="mr-2" />Documents</div>}>
        <Card>
          <CardBody>
            <Table aria-label="Documents table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>LAST MODIFIED</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>Q2 Report.pdf</TableCell>
                  <TableCell>PDF</TableCell>
                  <TableCell>Yesterday</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>Meeting Notes.docx</TableCell>
                  <TableCell>DOCX</TableCell>
                  <TableCell>3 days ago</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );

  const renderResourcesContent = () => (
    <Card>
      <CardBody>
        <h3>Extras</h3>
        <p>This section can contain additional resources or information.</p>
      </CardBody>
    </Card>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Organization Management</h2>
      <Tabs
        aria-label="Organization management tabs"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
      >
        <Tab 
          key="management" 
          title={
            <div className="flex items-center">
              Management
            </div>
          }
        >
          {renderManagementContent()}
        </Tab>
        <Tab 
          key="resources" 
          title={
            <div className="flex items-center">
              Resources
            </div>
          }
        >
          {renderResourcesContent()}
        </Tab>
      </Tabs>
    </div>
  );
};

export default OrganizationManagement;