import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePortalContext } from '@/context/portal-context-provider';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { LucideIcon, AlertCircle, FolderIcon, FileIcon, ChevronRightIcon, SearchIcon, FileCode, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from '@/hooks/hooks';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { Button } from '@/components/ui/button';
import { selectPortalContext } from '@/stores/features/apps/portal/portalsSlice';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ButtonWrapper } from "./custom-button";
import { ActionButtons } from "./action-buttons";
import { generateProjectSchema } from '@/utils/codeUtils';
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectStructure } from '@/types/code';

interface CustomButtonProps {
  handleClick: () => void;
  icon: LucideIcon;
  text: string;
  tooltipText: string;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ handleClick, icon: Icon, text, tooltipText, isLoading }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center justify-center gap-x-2 px-4 py-2
            bg-primary text-primary-foreground
            font-medium text-sm rounded-md
            shadow-md hover:shadow-lg transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          onClick={handleClick}
          disabled={isLoading}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{isLoading ? 'Processing...' : text}</span>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

interface NoStructureComponentProps {
  onRetry: () => void;
  isEmpty: boolean;
  onGenerateStructure: () => void;
  isLoading: boolean;
}

const NoStructureComponent: React.FC<NoStructureComponentProps> = ({ onRetry, isEmpty, onGenerateStructure, isLoading }) => {
  return (
    <motion.div 
      className="w-full h-full bg-background text-foreground flex flex-col p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ButtonWrapper />
      <div className="flex-grow flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Alert variant="warning" className="max-w-md w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-lg font-semibold">
              {isEmpty ? "Empty Project Structure" : "No Project Structure Found"}
            </AlertTitle>
            <AlertDescription className="text-sm mt-2">
              {isEmpty 
                ? "Your project structure is currently empty. You can generate a default structure or retry loading."
                : "We couldn't load your project structure. You can generate a default structure or retry loading."}
            </AlertDescription>
          </Alert>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center w-full space-y-4 sm:space-y-0 sm:space-x-4">
          <CustomButton
            handleClick={onRetry}
            icon={RefreshCw}
            text="Retry Loading"
            tooltipText="Attempt to reload the project structure"
            isLoading={isLoading}
          />
          <CustomButton
            handleClick={onGenerateStructure}
            icon={FileCode}
            text="Generate Structure"
            tooltipText="Create a default project structure"
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const CodeStructureSidebar: React.FC = () => {
  const params = useParams();
  const [project, setProject] = useState<Doc<"codes">>();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const context = useAppSelector(selectPortalContext);
  const getProject = useMutation(api.codes.getProject);
  const updateProject = useMutation(api.codes.updateProject);
  const { projectStructure, setProjectStructure, activeProject, currentComponent, setCurrentComponent } = usePortalContext();
  const setCodeGenerator = usePortalStore((state) => state.setCodeGenerator);

  const handleSelectFile = useCallback((file: string) => {
    setCodeGenerator(false);
    setCurrentComponent(file);
  }, [setCodeGenerator, setCurrentComponent]);

  const getProjectId = useCallback(() => {
    return activeProject || params.projectId || null;
  }, [activeProject, params]);

  const handleGetProjectStructure = useCallback((newProjectStructure: ProjectStructure) => {
    setProjectStructure(newProjectStructure);
    localStorage.setItem("projectStructure", JSON.stringify(newProjectStructure));
  }, [setProjectStructure]);

  const generateAndUpdateStructure = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectId = getProjectId();
      if (!projectId) return;
      const project = await getProject({ projectId });
      if (!project) return;
      const updateProjectStructure = generateProjectSchema(project.development.framework);
      await updateProject({
        id: projectId,
        project: { structure: updateProjectStructure }
      });
      setProject(project);
      handleGetProjectStructure(updateProjectStructure);
    } catch (error) {
      console.error("Error generating and updating project structure:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getProjectId, getProject, updateProject, handleGetProjectStructure]);

  const fetchProjectStructure = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectId = getProjectId();
      if (!projectId) return;
      const project = await getProject({ projectId });
      setProject(project);
      handleGetProjectStructure(project.structure);
    } catch (error) {
      setProjectStructure(null);
      console.error("Error fetching project structure:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getProjectId, getProject, handleGetProjectStructure, setProjectStructure]);

  useEffect(() => {
    if (context === "code-structure") {
      const storedStructure = localStorage.getItem("projectStructure");
      if (storedStructure) {
        setProjectStructure(JSON.parse(storedStructure));
      } else {
        fetchProjectStructure();
      }
    }
  }, [context, fetchProjectStructure, setProjectStructure]);

  const toggleFolder = useCallback((folder: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folder)) {
        newSet.delete(folder);
      } else {
        newSet.add(folder);
      }
      return newSet;
    });
  }, []);

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
  
  const renderTree = useCallback((tree: ProjectStructure, path: string = '') => {
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
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between w-full px-2 py-1 rounded-md hover:bg-secondary transition-colors duration-200">
                  <button
                    onClick={() => handleSelectFile(fullPath)}
                    className={`flex-grow text-left text-xs ${
                      currentComponent === fullPath ? 'text-primary font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <FileIcon size={12} />
                      <span className="truncate">{key}</span>
                    </div>
                  </button>
                  <ActionButtons project={project} path={fullPath} isFile={true} />
                </div>
              </TooltipTrigger>
              <TooltipContent>{fullPath}</TooltipContent>
            </Tooltip>
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
            <div className="flex items-center justify-between w-full px-2 py-1 rounded-md hover:bg-secondary transition-colors duration-200">
              <button
                onClick={() => toggleFolder(fullPath)}
                className="flex items-center flex-grow text-left text-xs"
              >
                <motion.div
                  animate={{ rotate: expandedFolders.has(fullPath) ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mr-1"
                >
                  <ChevronRightIcon size={12} />
                </motion.div>
                <FolderIcon size={12} className="mr-1" />
                <span className="truncate">{key}</span>
              </button>
              <ActionButtons project={project} path={fullPath} />
            </div>
            <AnimatePresence>
              {expandedFolders.has(fullPath) && (
                <motion.ul
                  className="pl-3 mt-1 space-y-1"
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
  }, [currentComponent, expandedFolders, handleSelectFile, project, toggleFolder]);

  if (projectStructure === null || (projectStructure && Object.keys(projectStructure).length === 0)) {
    return (
      <TooltipProvider>
        <NoStructureComponent 
          onRetry={fetchProjectStructure} 
          isEmpty={projectStructure && Object.keys(projectStructure).length === 0}
          onGenerateStructure={generateAndUpdateStructure}
          isLoading={isLoading}
        />
      </TooltipProvider>
    );
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
        <div className="p-2 border-b">
          <h2 className="text-sm font-semibold my-2">{project?.projectName || 'Project'}</h2>
          <div className="relative mb-2">
            <Input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-6 text-xs h-7"
            />
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={12} />
          </div>
          <ActionButtons project={project} path="" />
        </div>
        <ScrollArea className="flex-grow">
          <ul className="p-2 space-y-1">
            {filteredStructure && Object.keys(filteredStructure).length > 0 ? (
              renderTree(filteredStructure)
            ) : (
              <li className="text-center text-muted-foreground py-2 text-xs">No matching files found</li>
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


