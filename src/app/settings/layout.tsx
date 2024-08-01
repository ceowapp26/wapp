"use client";
import React, { useState } from "react";
import Header from '@/components/header';
import SidebarWrapper from './_components/sidebar';
import { useStoreUser } from "@/hooks/use-store-user";
import { Spinner } from "@/components/spinner";
import PaymentFormProvider from '@/components/forms/payment/form-provider';
import { SidebarContext } from "@/context/sidebar-context";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
 const { isLoading, isAuthenticated, role } = useStoreUser();
 const [sidebarOpen, setSidebarOpen] = useState<bolean>(false);
 const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  
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
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <div className="h-full flex dark:bg-[#1F1F1F]">
        <SidebarWrapper />
        <main className="flex-1 h-full overflow-y-auto transition-all duration-300">
          <Header />
          <PaymentFormProvider>
            {children}
          </PaymentFormProvider>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
 
export default SettingsLayout;
