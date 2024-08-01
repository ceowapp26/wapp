"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { roles as ClerkRoles } from "@/constants/authorization";
import { useStoreUser } from "@/hooks/use-store-user";
import Header from "@/components/header";

const HomeLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { isLoading, isAuthenticated, role } = useStoreUser();
  
  if (isLoading) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return ( 
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <main className="flex-1 h-full overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
   );
}
 
export default HomeLayout;




