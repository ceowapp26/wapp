"use client";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { MyspaceContextProvider } from "@/context/myspace-context-provider";
import { useStoreUser } from "@/hooks/use-store-user";
import { roles as ClerkRoles } from "@/constants/authorization";

const PublicLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {

  const { isLoading, isAuthenticated, role } = useStoreUser();
  
  if (isLoading) {
    return (
      <div className="h-full min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return ( 
    <MyspaceContextProvider>
      <div className="h-full dark:bg-[#1F1F1F]">
        {children}
      </div>
    </MyspaceContextProvider>
   );
}
 
export default PublicLayout;