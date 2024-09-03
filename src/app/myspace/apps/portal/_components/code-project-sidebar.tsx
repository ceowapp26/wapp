"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
  Share,
  FileUp,
  Filter,
  SquareArrowRight
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useFilter } from "@/hooks/use-filter";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { usePublish } from "@/hooks/use-publish";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Item } from "./code-item";
import { ProjectList } from "./project-list";
import { TrashBox } from "./trash-box";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { setPortalContext } from '@/stores/features/apps/portal/portalsSlice';
import { motion, AnimatePresence } from 'framer-motion';

export const CodeProjectSidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const filter = useFilter();
  const publish = usePublish();
  const uploadFile = useUploadFile();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { activeOrg, setActiveDocument, isLeftSidebarOpened, setIsLeftSidebarOpened, leftSidebarType, setLeftSidebarType, draggingItem, targetItem, setDraggingItem, setTargetItem } = useMyspaceContext();

  const handleSidebar = () => {
    dispatch(setPortalContext('code-structure'));
    if (!isLeftSidebarOpened) setIsLeftSidebarOpened(true);
  };

  const handleCreate = () => {
    // Implement your create functionality here
    console.log("Create new page");
  };

  return (
    <React.Fragment>
      <div className="mt-14 px-2">
        <Button
          className="flex items-center gap-x-3 px-3 py-3 mt-6 mb-4 ml-3
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white font-semibold text-md rounded-lg
                     shadow-lg hover:shadow-xl transition-all duration-300
                     transform hover:scale-105 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          onClick={handleSidebar}
        >
          <SquareArrowRight className="w-6 h-6" />
          <span>Enter Project</span>
        </Button>
        <Item
          label="Filter"
          icon={Filter}
          isFilter
          onClick={filter.onOpen}
        />
        <Item
          label="Search"
          icon={Search}
          isSearch
          onClick={search.onOpen}
        />
        <Item
          label="Publish"
          icon={Share}
          onClick={publish.onOpen}
        />
        <Item
          label="Settings"
          icon={Settings}
          onClick={settings.onOpen}
        />
      </div>
      <div className="relative py-4">
        <ProjectList />
      </div>
      <div className="mt-4">
        <Popover>
          <PopoverTrigger className="w-full mt-4">
            <Item label="Trash" icon={Trash} />
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-72"
            side={isMobile ? "bottom" : "right"}
          >
            <TrashBox />
          </PopoverContent>
        </Popover>
      </div>
    </React.Fragment>
  );
}