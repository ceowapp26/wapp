import React, { useState, useMemo } from 'react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  ScrollShadow
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Trash2 } from 'lucide-react';
import { FiFile, FiBox } from "react-icons/fi";
import { FileInterface } from "@/types/chat";
import ResourceTabs from './resource-tabs';

function extractTextContent(node: any): string {
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }

  if (typeof node === 'object' && node !== null) {
    if (node.type === 'text') {
      return node.text || '';
    }
    if (node.content) {
      return extractTextContent(node.content);
    }
  }

  return '';
}

function processJson(jsonString: string): string {
  try {
    const data = JSON.parse(jsonString);
    if (data.content) {
      const textContent = extractTextContent(data.content);
      return textContent.trim();
    } else {
      return "No content found in the JSON structure.";
    }
  } catch (error) {
    return "Invalid JSON string.";
  }
}

interface SystemFileProps {
  content?: string;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: Dispatch<SetStateAction<string>>;
}

const SystemFile: React.FC<SystemFileProps> = ({ content, setCurrentCodeFile, setCurrentEmbeddedFile, setCurrentComponent }) => {
  const [files, setFiles] = useState<FileInterface[]>([]);
  const documents = useQuery(api.documents.getDocumentSearch) || [];
  const projects = useQuery(api.codes.getProjectList) || [];

  const documentResources = useMemo(() => 
    documents.map(document => ({
      id: document._id,
      name: document.title,
      type: "text",
      content: processJson(document.content),
      size: 0,
    })), [documents]
  );

  const resources = {
    documents: documentResources,
    codes: projects,
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center space-x-3 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
        <FiBox className="w-6 h-6" />
        <span className="text-xl font-semibold tracking-wide">System File</span>
        <div className="flex-grow" />
      </div>
      <ResourceTabs 
        resources={resources} 
        content={content}
        setCurrentCodeFile={setCurrentCodeFile} 
        setCurrentEmbeddedFile={setCurrentEmbeddedFile} 
        setCurrentComponent={setCurrentComponent} 
      />
    </div>
  );
};

export default SystemFile;
