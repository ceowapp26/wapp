import React, { useState, useEffect, useCallback } from "react";
import { TabsMenu } from "./tabs-menu";
import { ScrollingBar } from "./scrolling-bar";
import { Input } from "@nextui-org/input";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Button as NextButton, Select, SelectItem } from "@nextui-org/react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { ChevronLeft, X, Search  } from 'lucide-react';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { getAppsByPlan } from '@/actions/app';

type App = {
  name: string;
  category: string;
  domain: string;
  logo: string;
  features: { id: string; name: string; description: string }[];
  license: string;
  platform: string;
};

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  minWidth: "128px",
  padding: '4px 8px',
  fontSize: '0.8rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const Header = () => {
  const { setRightSidebarType } = useMyspaceContext();
  const handleReturnBack = () => {
    setRightSidebarType("general");
  };
  return (
    <React.Fragment>
      <Box sx={{ mb: 4, px: 2 }}>
         <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton onClick={handleReturnBack} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">Settings</Typography>
          <Box width={24} />
        </Stack>
      </Box>
      <Divider sx={{ mb: 3 }} />
    </React.Fragment>
  );
};

export const MenuSidebar = () => {
  const { selectedSideMenu, rightSidebarWidth } = useMyspaceContext();
  const isSmallerThan480 = rightSidebarWidth < 480;
  const [apps, setApps] = useState<{ [key: string]: App }>({});
  const [filteredApps, setFilteredApps] = useState<{ [key: string]: App }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchBy, setSearchBy] = useState<"name" | "category">("name");
  const currentUser = useQuery(api.users.getCurrentUser);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!currentUser?.subscriptionInfo?.plan) return;
      const registeredApps = await getAppsByPlan(currentUser.subscriptionInfo.plan);
      if (isValidAppsData(registeredApps)) {
        setApps(registeredApps);
        setFilteredApps(registeredApps);
      } else {
        console.error('Error: getApps did not return expected format.');
      }
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const isValidAppsData = (data: unknown): data is Record<string, App> => {
    if (typeof data !== 'object' || data === null) return false;
    return Object.values(data).every(app => 
      typeof app === 'object' &&
      typeof app.name === 'string' &&
      typeof app.category === 'string' &&
      typeof app.domain === 'string' &&
      Array.isArray(app.features)
    );
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
    const filtered = Object.keys(apps).reduce((acc, key) => {
      const app = apps[key];
      if (
        (searchBy === "name" && app.name.toLowerCase().includes(term)) ||
        (searchBy === "category" && app.category.toLowerCase().includes(term))
      ) {
        acc[key] = app;
      }
      return acc;
    }, {} as { [key: string]: App });

    setFilteredApps(filtered);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as 'name' | 'category';
    setSearchBy(selectedValue);
  };

  const SearchAppResults = () => isLoading ? <LoadingSpinner /> : <TabsMenu apps={filteredApps} />;

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="pt-16">
      <Header />
      <ScrollingBar />
      {selectedSideMenu === "app" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search apps..."
                onChange={(e) => handleSearch(e.target.value)}
                size="lg"
                classNames={{
                  base: "w-full",
                  label: "text-sm text-gray-600 dark:text-gray-300",
                  input: [
                    "p-3",
                    "bg-white dark:bg-gray-800",
                    "text-gray-800 dark:text-gray-200",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "border border-gray-300 dark:border-gray-600",
                    "rounded-l-lg",
                    "transition-all duration-200 ease-in-out",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "bg-gray-100/50 py-1",
                    "hover:bg-gray-200/50 dark:hover:bg-gray-700",
                  ],
                }}
                startContent={
                  <Search className="text-gray-400 animate-pulse mr-2" />
                }
                endContent={
                  searchTerm && (
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onClick={() => handleSearch('')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <CloseIcon />
                    </Button>
                  )
                }
              />
            </div>
            <Select
              onChange={(e) => handleSelectChange(e)}
              placeholder="Filter by"
              size="lg"
              className="max-w-48"
              classNames={{
                trigger: [
                  "bg-white dark:bg-gray-800",
                  "border border-gray-300 dark:border-gray-600",
                  "rounded-r-lg",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                ],
                value: "text-gray-800 dark:text-gray-200",
                placeholder: "text-gray-400 dark:text-gray-500",
              }}
            >
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </Select>
          </div>
          <div className="mt-4">
            <SearchAppResults />
          </div>
        </div>
      )}
      {selectedSideMenu === "support" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search apps..."
                onChange={(e) => handleSearch(e.target.value)}
                size="lg"
                classNames={{
                  base: "w-full",
                  label: "text-sm text-gray-600 dark:text-gray-300",
                  input: [
                    "p-3",
                    "bg-white dark:bg-gray-800",
                    "text-gray-800 dark:text-gray-200",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "border border-gray-300 dark:border-gray-600",
                    "rounded-l-lg",
                    "transition-all duration-200 ease-in-out",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "bg-gray-100/50 py-1",
                    "hover:bg-gray-200/50 dark:hover:bg-gray-700",
                  ],
                }}
                startContent={
                  <Search className="text-gray-400 animate-pulse mr-2" />
                }
                endContent={
                  searchTerm && (
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onClick={() => handleSearch('')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <CloseIcon />
                    </Button>
                  )
                }
              />
            </div>
            <Select
              onChange={(e) => handleSelectChange(e)}
              placeholder="Filter by"
              size="lg"
              className="max-w-48"
              classNames={{
                trigger: [
                  "bg-white dark:bg-gray-800",
                  "border border-gray-300 dark:border-gray-600",
                  "rounded-r-lg",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                ],
                value: "text-gray-800 dark:text-gray-200",
                placeholder: "text-gray-400 dark:text-gray-500",
              }}
            >
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </Select>
          </div>
          <div className="mt-4">
            <SearchAppResults />
          </div>
        </div>
      )}
      {selectedSideMenu === "community" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search apps..."
                onChange={(e) => handleSearch(e.target.value)}
                size="lg"
                classNames={{
                  base: "w-full",
                  label: "text-sm text-gray-600 dark:text-gray-300",
                  input: [
                    "p-3",
                    "bg-white dark:bg-gray-800",
                    "text-gray-800 dark:text-gray-200",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "border border-gray-300 dark:border-gray-600",
                    "rounded-l-lg",
                    "transition-all duration-200 ease-in-out",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "bg-gray-100/50 py-1",
                    "hover:bg-gray-200/50 dark:hover:bg-gray-700",
                  ],
                }}
                startContent={
                  <Search className="text-gray-400 animate-pulse mr-2" />
                }
                endContent={
                  searchTerm && (
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onClick={() => handleSearch('')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <CloseIcon />
                    </Button>
                  )
                }
              />
            </div>
            <Select
              onChange={(e) => handleSelectChange(e)}
              placeholder="Filter by"
              size="lg"
              className="max-w-48"
              classNames={{
                trigger: [
                  "bg-white dark:bg-gray-800",
                  "border border-gray-300 dark:border-gray-600",
                  "rounded-r-lg",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                ],
                value: "text-gray-800 dark:text-gray-200",
                placeholder: "text-gray-400 dark:text-gray-500",
              }}
            >
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </Select>
          </div>
          <div className="mt-4">
            <SearchAppResults />
          </div>
        </div>
      )}
      {selectedSideMenu === "market" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search apps..."
                onChange={(e) => handleSearch(e.target.value)}
                size="lg"
                classNames={{
                  base: "w-full",
                  label: "text-sm text-gray-600 dark:text-gray-300",
                  input: [
                    "p-3",
                    "bg-white dark:bg-gray-800",
                    "text-gray-800 dark:text-gray-200",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "border border-gray-300 dark:border-gray-600",
                    "rounded-l-lg",
                    "transition-all duration-200 ease-in-out",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "bg-gray-100/50 py-1",
                    "hover:bg-gray-200/50 dark:hover:bg-gray-700",
                  ],
                }}
                startContent={
                  <Search className="text-gray-400 animate-pulse mr-2" />
                }
                endContent={
                  searchTerm && (
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onClick={() => handleSearch('')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <CloseIcon />
                    </Button>
                  )
                }
              />
            </div>
            <Select
              onChange={(e) => handleSelectChange(e)}
              placeholder="Filter by"
              size="lg"
              className="max-w-48"
              classNames={{
                trigger: [
                  "bg-white dark:bg-gray-800",
                  "border border-gray-300 dark:border-gray-600",
                  "rounded-r-lg",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                ],
                value: "text-gray-800 dark:text-gray-200",
                placeholder: "text-gray-400 dark:text-gray-500",
              }}
            >
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </Select>
          </div>
          <div className="mt-4">
            <SearchAppResults />
          </div>
        </div>
      )}
    </div>
  );
};
