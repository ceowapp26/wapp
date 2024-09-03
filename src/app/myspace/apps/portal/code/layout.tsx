"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { FilterCommand } from "@/components/apps/document/filter-command";
import { SearchCommand } from "@/components/apps/document/search-command";
import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { debounce } from 'lodash';
import { ReactProjectStructure, NextJsProjectStructure, VueProjectStructure, AngularProjectStructure, NodeProjectStructure, FlaskProjectStructure, createFile, createDirectory } from '@/types/code';
import Warning from "@/components/apps/document/modals/warning-modal";
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const CodeLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAppbarCollapsed, leftSidebarHeight } = useMyspaceContext();
  return (
    <main
      className={`relative flex-1 h-full overflow-y-auto hide-scrollbar ${
        isAppbarCollapsed ? "max-h-[117vh] top-[110px]" : "max-h-[100vh] top-[210px]"
      }`}
    >
      {children}
    </main>
  );
};

export default CodeLayout;
