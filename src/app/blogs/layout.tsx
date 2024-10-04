"use client";
import React, { useEffect, useState } from "react";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { useStoreUser } from "@/hooks/use-store-user";

const BlogLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useStoreUser();

  if (!isAuthenticated && !isLoading) return;

  if (isLoading) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      {children}
    </div>
  );
};

export default BlogLayout;


