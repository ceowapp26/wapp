"use client";
import React, { useState } from "react";
import Header from '@/components/header';
import SidebarWrapper from './_components/sidebar';
import { useStoreUser } from "@/hooks/use-store-user";
import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";
import PaymentFormProvider from '@/components/forms/payment/form-provider';
import { SidebarContext } from "@/context/sidebar-context";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, role } = useStoreUser();
  const [sidebarOpen, setSidebarOpen] = useState<bolean>(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated && !isLoading) return;

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
      <div className="h-full flex bg-transparent">
        <SidebarWrapper />
        <main className="flex-1 h-full max-h-screen transition-all duration-300">
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
