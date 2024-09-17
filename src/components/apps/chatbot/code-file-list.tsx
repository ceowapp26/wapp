import React, { useState } from 'react';
import { Accordion, AccordionItem, Button, Tooltip } from "@nextui-org/react";
import { FiCode, FiFolder, FiChevronRight, FiChevronDown, FiFile } from "react-icons/fi";

interface ProjectStructure {
  [key: string]: {
    type: 'directory' | 'file';
    content?: string;
    [key: string]: any;
  };
}

interface Project {
  projectName: string;
  structure: ProjectStructure;
}

interface CodeFileListProps {
  projects: Project[];
  onFileSelect: (projectName: string, file: string, content: string) => void;
}

const FileTreeNode: React.FC<{
  name: string;
  node: ProjectStructure[string];
  path: string;
  projectName: string;
  onFileSelect: (projectName: string, file: string, content: string) => void;
  depth: number;
  selectedFile: string | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ name, node, path, projectName, onFileSelect, depth, selectedFile, setSelectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const isSelected = selectedFile === path;

  if (node.type === 'directory') {
    return (
      <Accordion
        isCompact
        className={`${depth > 0 ? 'ml-4' : ''}`}
        defaultExpandedKeys={depth < 2 ? [path] : []}
      >
        <AccordionItem
          key={path}
          aria-label={name}
          title={
            <div className="flex items-center space-x-2 py-1">
              {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              <FiFolder className="text-yellow-500" size={16} />
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </div>
          }
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {Object.entries(node).map(([childName, childNode]) => {
            if (childName !== 'type') {
              return (
                <FileTreeNode
                  key={`${path}/${childName}`}
                  name={childName}
                  node={childNode as ProjectStructure[string]}
                  path={`${path}/${childName}`}
                  projectName={projectName}
                  onFileSelect={onFileSelect}
                  depth={depth + 1}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                />
              );
            }
            return null;
          })}
        </AccordionItem>
      </Accordion>
    );
  } else {
    return (
      <Tooltip content={path} placement="right">
        <Button
          light
          auto
          className={`w-full justify-start text-left transition-colors duration-200 py-1 ${
            isSelected
              ? 'bg-blue-100 hover:bg-blue-200'
              : 'bg-transparent hover:bg-gray-100'
          }`}
          onClick={() => {
            onFileSelect(projectName, path, node.content || '');
            setSelectedFile(path);
          }}
        >
          <div className="flex items-center space-x-2 ml-6">
            <FiFile className={`${isSelected ? 'text-blue-600' : 'text-blue-500'}`} size={16} />
            <span className={`text-sm ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-600'} truncate`}>
              {name}
            </span>
          </div>
        </Button>
      </Tooltip>
    );
  }
};

const CodeFileList: React.FC<CodeFileListProps> = ({ projects, onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="max-h-[600px] max-w-xl text-gray-800 overflow-y-auto bg-white rounded-lg shadow-md p-4">
      <Accordion>
        {projects.map((project) => (
          <AccordionItem
            key={project.projectName}
            aria-label={project.projectName}
            title={
              <div className="flex items-center space-x-2 py-2">
                <FiFolder className="text-green-500" size={20} />
                <span className="text-base font-semibold text-gray-800">{project.projectName}</span>
              </div>
            }
          >
            {Object.entries(project.structure).map(([name, node]) => (
              <FileTreeNode
                key={name}
                name={name}
                node={node}
                path={name}
                projectName={project.projectName}
                onFileSelect={onFileSelect}
                depth={0}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CodeFileList;