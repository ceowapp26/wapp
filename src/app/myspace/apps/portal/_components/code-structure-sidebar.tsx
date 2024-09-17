import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePortalContext } from '@/context/portal-context-provider';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Cover } from "@/components/apps/document/cover";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from 'next/navigation';
import { ProjectStructure } from '@/types/code';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, FileIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from '@/hooks/hooks';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { Button } from '@/components/ui/button';
import { selectPortalContext } from '@/stores/features/apps/portal/portalsSlice';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ButtonWrapper } from "./custom-button";
import { ActionButtons } from "./action-buttons";

const NoStructureComponent = ({ onRetry }) => {
  return (
    <TooltipProvider>
      <motion.div
        className="w-full h-full bg-background text-foreground flex flex-col pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ButtonWrapper />
        <div className="w-full h-full bg-background flex flex-col items-center">
          <Alert variant="warning" className="mb-6 max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Project Structure Found</AlertTitle>
            <AlertDescription>
              We couldn't load the project structure. This might be due to an empty project or a temporary issue.
            </AlertDescription>
          </Alert>
          <Button onClick={onRetry} className="mb-6">
            Retry Loading
          </Button>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export const CodeStructureSidebar: React.FC<SidebarProps> = () => {
  const currentPath = usePathname();
  const [project, setProject] = useState<any>({});
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [searchTerm, setSearchTerm] = useState('');
  const context = useAppSelector(selectPortalContext);
  const getProject = useMutation(api.codes.getProject);
  const { projectStructure, setProjectStructure, activeProject, currentComponent, setCurrentComponent } = usePortalContext();
  const setCodeGenerator = usePortalStore((state) => state.setCodeGenerator);
  
  const handleSelectFile = async (file: sring) => {
    setCodeGenerator(false);
    setCurrentComponent(file)
  };

  const fetchProjectStructure = useCallback(async (id: string) => {
    if (!id) return;
    try {
      const project = await getProject({ projectId: id });
      setProject(project);
      setProjectStructure(project.structure);
    } catch (error) {
      console.error("Error fetching project structure:", error);
    }
  }, [getProject, setProject, setProjectStructure]);

  const extractProjectId = useCallback((path: string): string | null => {
    const match = path.match(/\/myspace\/apps\/portal\/code\/([^\/]+)$/);
    if (match) {
      return match[1] || null;
    }
    return activeProject || null;
  }, [activeProject]);

  const projectId = useMemo(() => extractProjectId(currentPath), [extractProjectId, currentPath]);

  useEffect(() => {
    if (projectId && context === "code-structure") {
      fetchProjectStructure(projectId);
    }
  }, [projectId, context, fetchProjectStructure]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folder)) {
        newSet.delete(folder);
      } else {
        newSet.add(folder);
      }
      return newSet;
    });
  };

  const filteredStructure = useMemo(() => {
    if (!searchTerm) return projectStructure;
    const filterTree = (tree: ProjectStructure, path: string = ''): ProjectStructure | null => {
      const filteredTree: ProjectStructure = {};
      for (const [key, value] of Object.entries(tree)) {
        if (key === 'type') {
          filteredTree[key] = value;
          continue;
        }
        const fullPath = path ? `${path}/${key}` : key;
        if (value.type === 'file') {
          if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredTree[key] = value;
          }
        } else {
          const filteredSubtree = filterTree(value as ProjectStructure, fullPath);
          if (filteredSubtree && Object.keys(filteredSubtree).length > 1) {
            filteredTree[key] = filteredSubtree;
          }
        }
      }
      return Object.keys(filteredTree).length > 1 ? filteredTree : null;
    };
    return filterTree(projectStructure);
  }, [projectStructure, searchTerm]);

  const renderTree = (tree: ProjectStructure, path: string = '') => {
    return Object.entries(tree).map(([key, value]) => {
      if (key === 'type') return null;
      const fullPath = path ? `${path}/${key}` : key;
      if (value.type === 'file') {
        return (
          <motion.li
            key={fullPath}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-secondary transition-colors duration-200">
                    <button
                      onClick={() => handleSelectFile(fullPath)}
                      className={`flex-grow text-left ${
                        currentComponent === fullPath
                          ? 'text-primary font-semibold'
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FileIcon size={16} />
                        <span className="truncate">{key}</span>
                      </div>
                    </button>
                    <ActionButtons project={project} path={fullPath} isFile={true} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{fullPath}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.li>
        );
      } else {
        return (
          <motion.li
            key={fullPath}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-secondary transition-colors duration-200">
              <button
                onClick={() => toggleFolder(fullPath)}
                className="flex items-center flex-grow text-left"
              >
                <motion.div
                  animate={{ rotate: expandedFolders.has(fullPath) ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mr-2"
                >
                  <ChevronRightIcon size={16} />
                </motion.div>
                <FolderIcon size={16} className="mr-2" />
                <span className="truncate">{key}</span>
              </button>
              <ActionButtons project={project} path={fullPath} />
            </div>
            <AnimatePresence>
              {expandedFolders.has(fullPath) && (
                <motion.ul
                  className="pl-4 mt-1 space-y-1"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTree(value as ProjectStructure, fullPath)}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>
        );
      }
    });
  };

  if (projectStructure === undefined || projectStructure === null || Object.keys(projectStructure).length === 0) {
    return <NoStructureComponent onRetry={() => fetchProjectStructure(projectId)} />;
  }

  return (
    <TooltipProvider>
      <motion.div
        className="w-full h-full bg-background text-foreground flex flex-col pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ButtonWrapper />
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-2">{project.projectName || 'Project'}</h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
          <ActionButtons project={project} path="" />
        </div>
        <ScrollArea className="flex-grow">
          <ul className="p-2 space-y-1">
            {filteredStructure && Object.keys(filteredStructure).length > 0 ? (
              renderTree(filteredStructure)
            ) : (
              <li className="text-center text-muted-foreground py-4">No matching files found</li>
            )}
          </ul>
        </ScrollArea>
      </motion.div>
    </TooltipProvider>
  );
};

// Helper function to get all file paths
const getAllFilePaths = (obj: ProjectStructure, currentPath: string = ''): string[] => {
  let paths: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'type') continue;
    const newPath = currentPath ? `${currentPath}/${key}` : key;
    if (value.type === 'directory') {
      paths = paths.concat(getAllFilePaths(value, newPath));
    } else {
      paths.push(newPath);
    }
  }
  return paths;
};

