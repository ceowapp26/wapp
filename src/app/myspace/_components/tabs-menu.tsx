import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { AppIcon } from "./app-icon";
import "react-tabs/style/react-tabs.css";
import { App } from "@/constants/app";

type TabsMenuProps = {
  apps: { [key: string]: App };
};

export const TabsMenu: React.FC<TabsMenuProps> = ({ apps }) => {
  return (
    <Tabs>
      <TabList>
        <Tab>Apps</Tab>
        <Tab>Extensions</Tab>
      </TabList>
      <TabPanel>
        <div className="flex flex-col items-center justify-center scroll-smooth overflow-y-auto">
          {apps && Object.keys(apps).length > 0 ? (
            Object.keys(apps)
              .map((appKey) => (
                <AppIcon
                  appName={apps[appKey].name}
                  logo={apps[appKey].logo}
                  url={apps[appKey].url}
                />
              ))
          ) : (
            <h2 className="p-4 font-semibold text-gray-600/80">No apps available.</h2>
          )}
        </div>
      </TabPanel>
      <TabPanel>
        <h2 className="p-4 font-semibold text-gray-600/80">No extensions available.</h2>
      </TabPanel>
    </Tabs>
  );
};
