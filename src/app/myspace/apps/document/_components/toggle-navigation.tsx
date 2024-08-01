"use client";
import React from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { MenuIcon, ChevronsRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface ToggleProps {
  isCollapsed: boolean;
  isMobile: boolean;
  isHoveringLeftEdge: boolean;
  onResetWidth: () => void;
}

export const ToggleNavigation = ({
  isCollapsed,
  isMobile,
  isHoveringLeftEdge,
  onResetWidth,
}: ToggleProps) => {
  const params = useParams();

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <nav className="dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <React.Fragment>
      <Publish initialData={document} />
      {isCollapsed && (
        isMobile ? (
          <MenuIcon onClick={onResetWidth} role="button" className="h-6 w-6 text-muted-foreground" />
        ) : (
          <span className={`bg-transparent w-[30px] ${isHoveringLeftEdge ? 'left-60' : 'left-0'} h-full top-0 flex relative justify-end items-center rounded-r-lg`}>
            <ChevronsRight onClick={onResetWidth} role="button" className="h-6 w-6 text-muted-foreground" />
          </span>
        )
      )}
      {document.isArchived && (
        <Banner documentId={document._id} />
      )}
    </React.Fragment>
  );
}
