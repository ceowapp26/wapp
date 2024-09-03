"use client";

import React from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { MenuIcon, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";
import { cn } from "@/lib/utils";

interface ToggleProps {
  isCollapsed: boolean;
  isMobile: boolean;
  isLeftSidebarOpened: boolean;
  isHoveringLeftEdge: boolean;
  onResetWidth: () => void;
}

export const ToggleNavigation = ({
  isCollapsed,
  isMobile,
  isHoveringLeftEdge,
  isLeftSidebarOpened,
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
      {(isCollapsed || !isLeftSidebarOpened)  && (
        isMobile ? (
          <motion.button
            onClick={onResetWidth}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent fixed top-2 p-6 left-10 z-50"
          >
            <MenuIcon className="h-6 w-6 text-muted-foreground" />
          </motion.button>
        ) : (
          <motion.button
            onClick={onResetWidth}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
             className={cn(
              "p-2 rounded-r-lg bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30 left-0 top-0",
              isHoveringLeftEdge ? "opacity-100" : "opacity-0"
            )}
          >
            <ChevronsRight className="h-6 w-6 text-muted-foreground" />
          </motion.button>
        )
      )}
      {document.isArchived && (
        <Banner documentId={document._id} />
      )}
    </React.Fragment>
  );
};

