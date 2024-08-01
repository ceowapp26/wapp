"use client";
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
  Filter
} from "lucide-react";
import { NavigationSkeleton } from "./navigation-skeleton";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
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
import { Item } from "./item";
import { DocumentList } from "./document-list";
import { TrashBox } from "./trash-box";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { Button } from "@/components/ui/button";
import { SquareArrowRight } from 'lucide-react';

export const DocumentSidebar = () => {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const filter = useFilter();
  const params = useParams();
  const publish = usePublish();
  const pathname = usePathname();
  const uploadFile = useUploadFile();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { activeOrg, setActiveDocument, isLeftSidebarOpened, setIsLeftSidebarOpened, leftSidebarType, setLeftSidebarType } = useMyspaceContext();
  const createDocument = useMutation(api.documents.createDocument);

  const handleCreate = () => {
    let createDocumentFunc;
    if (activeOrg.orgName === "Select Account" || !activeOrg.orgName || activeOrg.orgName === "Personal Account") {
      createDocumentFunc = createDocument({ title: "Untitled" });
    } else {
      createDocumentFunc = createDocument({ title: "Untitled", orgId: activeOrg.orgId });
    }

    const promise = createDocumentFunc
      .then((documentId) => {
        router.prefetch(`/myspace/apps/document/${documentId}`);
        router.push(`/myspace/apps/document/${documentId}`);
      });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  const handleSidebar = () => {
    if (leftSidebarType !== 'left-ai') setLeftSidebarType('left-ai');
    if (!isLeftSidebarOpened) setIsLeftSidebarOpened(true);
  };

  return (
    <>
      <div>
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
          <span>Enter Chat</span>
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
          label="Upload"
          icon={FileUp}
          onClick={uploadFile.onOpen}
        />
        <Item
          label="Settings"
          icon={Settings}
          onClick={settings.onOpen}
        />
        <Item
          onClick={handleCreate}
          label="New page"
          icon={PlusCircle}
        />
      </div>
      <div className="mt-4">
        <DocumentList />
        <Item
          onClick={handleCreate}
          icon={Plus}
          label="Add a page"
        />
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
    </>
  );
}
