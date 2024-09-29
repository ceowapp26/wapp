"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getAppsByPlan } from '@/actions/app';
import { AppCard } from "@/app/myspace/_components/app-card";
import { ModeToggle } from "@/components/mode-toggle";
import UserDropdown from "@/components/auth/user-dropdown";
import { Search, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ColorfulLoadingCircle from "@/components/colorful-loading-circle";

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /*useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gridSize = 50;
    const lineWidth = 0.5;

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.1)';
      ctx.lineWidth = lineWidth;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animateStroke = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const direction = Math.random() < 0.5 ? 'vertical' : 'horizontal';

      ctx.strokeStyle = 'rgba(128, 0, 128, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      if (direction === 'vertical') {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      } else {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }

      ctx.stroke();

      setTimeout(() => {
        drawGrid();
      }, 200);
    };

    const animate = () => {
      drawGrid();
      setInterval(animateStroke, 1000);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);*/

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-x-48 inset-y-48 w-full h-full z-0 opacity-80 pointer-events-none"
      />
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute text-purple-500 opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {['🚀', '💻', '🔧', '📱', '🎨'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

interface App {
  name: string;
  category: string;
  domain: string;
  logo: string;
  features: { id: string; name: string; description: string }[];
  license: string;
  platform: string;
}

type SearchBy = 'name' | 'category';

const AppsPage: React.FC = () => {
  const [apps, setApps] = useState<Record<string, App>>({});
  const [filteredApps, setFilteredApps] = useState<Record<string, App>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchBy, setSearchBy] = useState<SearchBy>('name');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const currentUser = useQuery(api.users.getCurrentUser);

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!currentUser?.subscriptionInfo?.planType) return;
      const registeredApps = await getAppsByPlan(currentUser.subscriptionInfo.planType);
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
    if (currentUser && Object.entries(apps).length === 0) {
      fetchApps();
    }
  }, [currentUser, apps]);

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

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term.toLowerCase());
    const filtered = Object.entries(apps).reduce((acc, [key, app]) => {
      if (app[searchBy].toLowerCase().includes(term.toLowerCase())) {
        acc[key] = app;
      }
      return acc;
    }, {} as Record<string, App>);

    setFilteredApps(filtered);
  }, [apps, searchBy]);

  const handleSelectChange = (value: SearchBy) => {
    setSearchBy(value);
    handleSearch(searchTerm);
  };

  const clearSearch = () => handleSearch('');

  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-10 py-10 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen w-full overflow-y-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 dark:text-purple-300 mb-2">WAPP'S APPS COLLECTION</h1>
          <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Find the best app for you or your business</h2>
        </div>
        <div className="flex items-center gap-x-4">
          <Link href="/support" className="text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 transition-colors">
            Support Center
          </Link>
          <ModeToggle />
          <UserDropdown />
        </div>
      </header>
      <div className="flex flex-col md:flex-row items-center justify-center mb-8 gap-4">
        <div className="flex items-center w-full md:w-2/3 relative">
          <Input
            placeholder={`Search by ${searchBy}`}
            value={searchTerm}
            onValueChange={handleSearch}
            variant="bordered"
            className="w-full"
            startContent={<Search className="text-gray-400" />}
            endContent={
              searchTerm && (
                <Button isIconOnly variant="light" onClick={clearSearch}>
                  <X className="text-gray-400" />
                </Button>
              )
            }
          />
          <Button onClick={toggleFilters} auto className="ml-2">
            <Filter className="text-gray-400" />
          </Button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full md:w-1/3"
            >
              <Select
                label="Search by"
                selectedKeys={[searchBy]}
                onChange={(e) => handleSelectChange(e.target.value as SearchBy)}
                className="w-full"
              >
                <SelectItem key="name" value="name">Name</SelectItem>
                <SelectItem key="category" value="category">Category</SelectItem>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {isLoading ? (
        <ColorfulLoadingCircle width={32} height={32} background={'purple'} />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 laptopMB:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {Object.entries(filteredApps).map(([key, app]) => (
            <motion.div
              className="flex justify-center items-center"
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AppCard {...app} />
            </motion.div>
          ))}
        </motion.div>
      )}
      <AnimatedBackground />
      {!isLoading && Object.keys(filteredApps).length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl text-gray-600 dark:text-gray-300">No apps found. Try adjusting your search.</p>
        </motion.div>
      )}
    </div>
  );
};

export default AppsPage;

