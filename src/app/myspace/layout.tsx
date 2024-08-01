"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spinner } from '@/components/spinner';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { addToLists, selectApps } from '@/redux/features/apps/appsSlice';
import { NavbarPanel } from "./_components/navbar-panel";
import { SwitchRightSidebar } from "./_components/switch-sidebar";
import { AppHorizontalBar } from "./_components/app-horizontal-bar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStoreUser } from "@/hooks/use-store-user";
import { getAppsByPlan } from "@/actions/app";
import i18n from '@/i18n';

interface LayoutProps {
  children: React.ReactNode;
  appName: string;
}

interface AppInfo {
  appName: string;
  url: string;
  logo: string;
}

const RenderLayout: React.FC<LayoutProps> = ({ children, appName }) => {
  const { isLoading, isAuthenticated } = useStoreUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const apps = useAppSelector(selectApps);
  const [appArray, setAppArray] = useState<Record<string, AppInfo>>({});
  const pathname = usePathname();
  const getActiveUser = useMutation(api.users.getActiveUser);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    const languageChangeHandler = (lng: string) => {
      document.documentElement.lang = lng;
    };
    i18n.on('languageChanged', languageChangeHandler);
    return () => {
      i18n.off('languageChanged', languageChangeHandler);
    };
  }, []);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const currentUser = await getActiveUser();
        if (!currentUser?.subscriptionInfo?.plan) return;

        const userCurrentPlan = currentUser.subscriptionInfo.plan;
        const fetchedApps = await getAppsByPlan(userCurrentPlan);

        if (!fetchedApps || Object.keys(fetchedApps).length === 0) {
          console.error("No apps found or apps object is invalid.");
          return;
        }

        const newAppArray = Object.entries(fetchedApps).reduce((acc, [app, appData]) => {
          const regex = new RegExp(appData.domain);
          if (regex.test(pathname)) {
            acc[appData.name] = { appName: appData.name, url: pathname, logo: appData.logo };
          }
          return acc;
        }, {} as Record<string, AppInfo>);

        setAppArray(newAppArray);
      } catch (error) {
        console.error("Error fetching or processing apps:", error);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchApps();
    }
  }, [pathname, getActiveUser, isAuthenticated, isLoading]);

  useEffect(() => {
    if (Object.keys(appArray).length === 0) {
      console.warn("No matching URLs found.");
      return;
    }
    Object.values(appArray).forEach((appInfo) => {
      dispatch(addToLists(appInfo));
    });
  }, [appArray, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  const isNoLayoutPath = (path: string) => {
    return path.endsWith("/myspace/apps") || path.endsWith("/myspace");
  };

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <main id="myspace" className="flex-1 overflow-y-auto">
        {!isNoLayoutPath(pathname) && (
          <>
            <AppHorizontalBar />
            <NavbarPanel />
            <SwitchRightSidebar />
          </>
        )}
        {children}
      </main>
    </div>
  );
};

const MyspaceLayout: React.FC<LayoutProps> = ({ children, appName }) => (
  <div className="h-full min-h-screen">
    <RenderLayout appName={appName}>{children}</RenderLayout>
  </div>
);

export default MyspaceLayout;