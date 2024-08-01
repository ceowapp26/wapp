"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Accordion, AccordionItem, Chip, Tooltip } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import { ArrowRight, Book, Layout, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type AppCardProps = {
  name: string;
  category: string;
  logo: string;
  features: { id: string; name: string; description: string }[];
  domain: string;
  license: string;
  platform: string;
};

export const AppCard: React.FC<AppCardProps> = ({
  name,
  category,
  logo,
  features,
  domain,
  license,
  platform,
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const redirectAPP = () => {
    router.push(domain)
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        className="max-w-[450px] bg-white dark:bg-gray-800 shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <div className="flex items-center">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-md">
              <Image 
                src={logo} 
                alt={name}
                width={36}
                height={36}
              />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{name}</h3>
              <Chip size="sm" variant="flat" className="mt-1 p-1 bg-blue-500 dark:bg-blue-700 text-white">{category}</Chip>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-5 py-6 bg-gray-50 dark:bg-gray-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              className="w-full mb-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105" 
              onClick={redirectAPP} 
              endContent={<ArrowRight className="ml-2" />}
              size="lg"
            >
              Enter App
            </Button>         
          </motion.div>
          <Accordion 
            selectionMode="multiple" 
            className="bg-white dark:bg-gray-700 rounded-lg shadow-inner"
          >
            {features.map((feature, index) => (
              <AccordionItem 
                key={index} 
                aria-label={feature.name} 
                title={
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {feature.name}
                  </span>
                }
                className="border-b last:border-b-0"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
        <CardFooter className="flex justify-between items-center px-5 py-4 gap-x-4 bg-gray-100 dark:bg-gray-900">
          <div className="flex space-x-2">
            <Tooltip content={`License: ${license}`}>
              <Chip 
                className="p-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100"
                startContent={<Book size={16} className="mr-1 text-blue-500 dark:text-blue-300" />} 
                variant="flat" 
                size="sm"
              >
                {license}
              </Chip>
            </Tooltip>
            <Tooltip content={`Platform: ${platform}`}>
              <Chip 
                className="p-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100"
                startContent={<Layout size={16} className="mr-1 text-purple-500 dark:text-purple-300" />} 
                variant="flat" 
                size="sm"
              >
                {platform}
              </Chip>
            </Tooltip>
          </div>
          <Button 
            auto 
            size="sm"
            endContent={<Info size={16} />}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};