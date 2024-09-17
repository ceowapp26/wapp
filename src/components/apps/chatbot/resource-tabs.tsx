import React, { useState } from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import { FiFile, FiMessageSquare, FiMusic, FiImage, FiVideo } from "react-icons/fi";
import Files from "./file-component";

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'chats': return <FiMessageSquare className="text-blue-500" />;
    case 'documents': case 'codes': return <FiFile className="text-green-500" />;
    case 'audios': return <FiMusic className="text-yellow-500" />;
    case 'images': return <FiImage className="text-purple-500" />;
    case 'videos': return <FiVideo className="text-red-500" />;
    default: return <FiFile className="text-gray-500" />;
  }
};

const ResourceTabs: React.FC<{ resources: ResourcesProps, handleFileSelect: (file: FileInterface) => void }> = ({ resources, handleFileSelect }) => (
  <Tabs
    aria-label="Resource tabs"
    color="primary"
    variant="underlined"
    classNames={{
      tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
      cursor: "w-full bg-primary",
      tab: "max-w-fit px-0 h-12",
      tabContent: "group-data-[selected=true]:text-blue-600 text-gray-800"
    }}
  >
    {Object.entries(resources).map(([key, data]) => (
      <Tab 
        key={key} 
        title={
          <div className="flex items-center space-x-2">
            {getIcon(key)}
            <span className="capitalize">{key}</span>
          </div>
        }
      >
        <Files 
          resourceType={key} 
          data={data} 
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'type', label: 'Type' },
          ]}
          handleFileSelect={handleFileSelect}
        />
      </Tab>
    ))}
  </Tabs>
);

export default ResourceTabs;