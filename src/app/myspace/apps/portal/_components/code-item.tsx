"use client";
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Trash, Plus, MoreHorizontal, ChevronDown, ChevronRight, Building, Settings2, Rocket } from "lucide-react";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { useGeneralContext } from "@/context/general-context-provider";
import { useDocumentMetadatas } from "@/hooks/use-document-metadatas";
import { useDocumentManagement } from "@/hooks/use-document-management";
import { useProjectSettings } from "@/hooks/use-project-settings";
import { useProjectDeployments } from "@/hooks/use-project-deployments";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

interface ItemProps {
  id?: Id<"codes">;
  fileIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  isFilter?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: React.ElementType;
  isCode?: boolean;
  language?: string;
};

export const Item: React.FC<ItemProps> & { Skeleton: React.FC<{ level?: number }> } = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  fileIcon,
  isSearch,
  isFilter, 
  level = 0,
  onExpand,
  expanded,
  isCode,
  language,
}) => {
  const { user } = useUser();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const metadatas = useDocumentMetadatas();
  const managements = useDocumentManagement();
  const settings = useProjectSettings();
  const deployments = useProjectDeployments();

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand?.();
  };

  const handleMetadata = (e: React.MouseEvent) => {
    e.stopPropagation();
    metadatas.onOpen(id);
  };

  const handleManagement = (e: React.MouseEvent) => {
    e.stopPropagation();
    managements.onOpen(id);
  };

  const handleSetting = (e: React.MouseEvent) => {
    e.stopPropagation();
    settings.onOpen();
  };

  const handleDeployment = (e: React.MouseEvent) => {
    e.stopPropagation();
    deployments.onOpen();
  };

  const onArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement archive functionality
  };

  const onCreate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement create functionality
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={onClick}
        role="button"
        style={{ paddingLeft: level ? `${(level * 12) + 12}px` : "12px" }}
        className={cn(
          "group min-h-[50px] text-sm py-3 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium rounded-lg transition-all duration-200 ease-in-out",
          active && "bg-primary/10 text-primary shadow-sm"
        )}
      >
        {fileIcon ? (
          <div className="shrink-0 mr-3 text-[20px]">
            {fileIcon}
          </div>
        ) : (
          <Icon className="shrink-0 h-[24px] w-[24px] mr-3 text-muted-foreground" />
        )}
        <span className="truncate font-semibold">{label}</span>
        {isCode && (
          <Badge 
            variant="outline" 
            className={`ml-4 text-xs ${getLanguageColors(language).bg} ${getLanguageColors(language).text}`}
          >
            {language}
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
            <div role="button" className="h-8 w-8 p-1 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-200">
              <MoreHorizontal className="h-6 w-6 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
            <DropdownMenuItem onClick={onArchive} className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleManagement} className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200">
              <Building className="h-4 w-4 mr-2" />
              Organization
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSetting} className="hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-200">
              <Settings2 className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeployment} className="hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-200">
              <Rocket className="h-4 w-4 mr-2" />
              Deployment
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="text-xs text-muted-foreground p-2 bg-neutral-100 dark:bg-neutral-800 rounded-b-md">
              Last edited by: {user?.fullName}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    </motion.div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
      }}
      className="flex gap-x-2 py-3"
    >
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-5 w-[60%] rounded-md" />
    </div>
  );
};

//helper function
const getLanguageColors = (language: string): { bg: string; text: string } => {
  const lowercaseLang = language.toLowerCase();
  switch (lowercaseLang) {
    case 'javascript':
      return { bg: 'bg-yellow-200', text: 'text-yellow-800' };
    case 'typescript':
      return { bg: 'bg-blue-200', text: 'text-blue-800' };
    case 'python':
      return { bg: 'bg-green-200', text: 'text-green-800' };
    case 'java':
      return { bg: 'bg-orange-200', text: 'text-orange-800' };
    case 'c#':
      return { bg: 'bg-purple-200', text: 'text-purple-800' };
    case 'php':
      return { bg: 'bg-indigo-200', text: 'text-indigo-800' };
    case 'ruby':
      return { bg: 'bg-red-200', text: 'text-red-800' };
    case 'go':
      return { bg: 'bg-cyan-200', text: 'text-cyan-800' };
    case 'rust':
      return { bg: 'bg-amber-200', text: 'text-amber-800' };
    default:
      return { bg: 'bg-gray-200', text: 'text-gray-800' };
  }
};
