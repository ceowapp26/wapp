"use client";
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Trash, Plus, MoreHorizontal, ChevronDown, ChevronRight, File, Folder, Building } from "lucide-react";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { useGeneralContext } from "@/context/general-context-provider";
import { useDocumentMetadatas } from "@/hooks/use-document-metadatas";
import { useDocumentManagement } from "@/hooks/use-document-management";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  isFilter?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: React.ElementType;
};

export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  isFilter, 
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);
  const archiveDocument = useMutation(api.documents.archiveDocument);
  const updateDocument = useMutation(api.documents.updateDocument);
  const { setSelectedDocument } = useGeneralContext();
  const { activeOrg, setActiveDocument } = useMyspaceContext();
  const metadatas = useDocumentMetadatas()
  const managements = useDocumentManagement();

  useEffect(() => {
    router.prefetch("/myspace/apps/document");
  }, []);

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archiveDocument({ id })
      .then(() => router.push("/myspace/apps/document"));

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note."
    });
  };

  const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleMetadata = () => {
    if (!id) return;
    setSelectedDocument(id);
    metadatas.onOpen();
  };

  const handleManagement = () => {
    if (!id) return;
    setSelectedDocument(id);
    managements.onOpen();
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    let createDocumentFunc;
    if (activeOrg.orgName === "Select Account" || !activeOrg.orgName || activeOrg.orgName === "Personal Account") {
      createDocumentFunc = createDocument({ title: "Untitled", parentDocument: id });
    } else {
      createDocumentFunc = createDocument({ title: "Untitled", activeOrgId: activeOrg.orgId, parentDocument: id });
    }

    const promise = createDocumentFunc
      .then((documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.prefetch(`/myspace/apps/document/${documentId}`);
        router.push(`/myspace/apps/document/${documentId}`);
        setActiveDocument(documentId);
      });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${(level * 12) + 12}px` : "12px" }}
      className={cn(
        "group min-h-[40px] text-sm py-2 pr-3 w-full hover:bg-primary/10 flex items-center text-muted-foreground font-medium rounded-md transition-all duration-200 ease-in-out",
        active && "bg-primary/15 text-primary shadow-sm"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1 p-1 transition-colors duration-200"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-3 text-[20px]">
          {documentIcon}
        </div>
      ) : (
        <Icon className="shrink-0 h-[20px] w-[20px] mr-3 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {!!id && (
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
              <DropdownMenuItem onClick={handleManagement}className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200">
                <Building className="h-4 w-4 mr-2" />
                  Organization
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMetadata} className="hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-200">
                <Plus className="h-4 w-4 mr-2" />
                More
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2 bg-neutral-100 dark:bg-neutral-800 rounded-b-md">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="h-8 w-8 p-1 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-200"
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
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
