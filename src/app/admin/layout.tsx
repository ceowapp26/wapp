"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { useStoreUser } from "@/hooks/use-store-user";
import SideBar from './_components/sidebar'
import Header from './_components/header'

const AdminLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { isLoading, isAuthenticated } = useStoreUser();
  
  if (isLoading) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
    return null;
  }

  return ( 
    <div className="flex h-full w-full">
      <SideBar />
      <div className="w-full max-h-screen flex flex-col pl-20 md:pl-4">
        <Header />
        {children}
      </div>
    </div>
   );
}
 
export default AdminLayout;


