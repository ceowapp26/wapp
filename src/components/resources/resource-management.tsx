import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tab,
  Tabs,
  Card,
  CardBody,
} from "@nextui-org/react";
import { FiMessageSquare, FiFile, FiMusic, FiImage, FiVideo } from "react-icons/fi";

type ColumnConfig = {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
};

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'chats': return <FiMessageSquare />;
    case 'documents': case 'codes': return <FiFile />;
    case 'audios': return <FiMusic />;
    case 'images': return <FiImage />;
    case 'videos': return <FiVideo />;
    default: return <FiFile />;
  }
};

const ResourceTable = ({ data, columns, resourceType }: { data: any[], columns: ColumnConfig[], resourceType: string }) => (
  <Card>
    <CardBody>
      <Table aria-label={`${resourceType} table`}>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(item[column.key]) : item[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardBody>
  </Card>
);

const ResourceTabs = ({ resources }) => (
  <Tabs>
    {Object.entries(resources).map(([key, data]) => (
      <Tab 
        key={key} 
        title={
          <div className="flex items-center">
            {getIcon(key)}
            <span className="ml-2">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </div>
        }
      >
        <ResourceTable 
          resourceType={key} 
          data={data} 
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'type', label: 'Type' },
            { key: 'lastModified', label: 'Last Modified' },
          ]}
        />
      </Tab>
    ))}
  </Tabs>
);

const ResourceManagement = () => {
  const [selectedTab, setSelectedTab] = React.useState("management");

  const resources = {
    chats: [
      { name: "Project Alpha", type: "5 participants", lastModified: "2 hours ago" },
      { name: "Team Brainstorm", type: "8 participants", lastModified: "1 day ago" },
    ],
    documents: [
      { name: "Q2 Report.pdf", type: "PDF", lastModified: "Yesterday" },
      { name: "Meeting Notes.docx", type: "DOCX", lastModified: "3 days ago" },
    ],
    codes: [
      { name: "Component.tsx", type: "TSX", lastModified: "Yesterday" },
      { name: "useHook.tsx", type: "TSX", lastModified: "3 days ago" },
    ],
    audios: [
      { name: "Voiceover.mp3", type: "MP3", lastModified: "Yesterday" },
      { name: "Animation.mp3", type: "MP3", lastModified: "3 days ago" },
    ],
    images: [
      { name: "AI.png", type: "PNG", lastModified: "Yesterday" },
      { name: "Future.jpg", type: "JPG", lastModified: "3 days ago" },
    ],
    videos: [
      { name: "AI.mp4", type: "MP4", lastModified: "Yesterday" },
      { name: "Future.mp4", type: "MP4", lastModified: "3 days ago" },
    ],
  };

  const renderManagementContent = () => <ResourceTabs resources={resources} />;

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
      <h2 className="text-2xl font-bold mb-4">Resource Management</h2>
      <Tabs
        aria-label="Organization management tabs"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
      >
        <Tab key="management" title={<div className="flex items-center">Management</div>}>
          {renderManagementContent()}
        </Tab>
        <Tab key="resources" title={<div className="flex items-center">Resources</div>}>
          {renderResourcesContent()}
        </Tab>
      </Tabs>
    </div>
  );
};

export default ResourceManagement;