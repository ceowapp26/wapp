"use client"
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, Button, Tooltip } from "@nextui-org/react";
import { Code, Settings, Zap, GitBranch, Database, Shield, Rocket } from 'lucide-react';
import CodeProjectConfig from "../_components/code-project-config";
import SettingsButton from '../_components/settings-button';
import SettingsModal from '../_components/settings-modal';
import dynamic from 'next/dynamic';

const ProjectPrompt = dynamic(() => import('../_components/project-prompt'), { ssr: false });

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 opacity-20">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

const FloatingIcons = () => {
  const icons = [Code, GitBranch, Database, Shield, Rocket];
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-primary-300 opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={30 + Math.random() * 20} />
        </motion.div>
      ))}
    </div>
  );
};

export default function ProjectHomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>("");
  const { theme } = useTheme();
  const [projectConfigs, setProjectConfigs] = useState({
    general: {
      projectName: 'project',
      projectType: 'web',
      version: '1.0.0',
      description: '',
    },
    development: {
      language: 'JavaScript',
      framework: 'React',
      buildTool: 'Webpack',
      packageManager: 'npm',
    },
    testing: {
      framework: 'Jest',
      e2eFramework: 'Cypress',
    },
    database: {
      type: 'SQL',
      name: 'PostgreSQL',
      orm: 'Sequelize',
    },
    deployment: {
      platform: 'AWS',
      cicdTool: 'GitHub Actions',
      containerization: 'Docker',
    },
    security: {
      authentication: 'JWT',
      authorization: 'RBAC',
      dataEncryption: true,
    },
    performance: {
      caching: 'Redis',
      cdn: 'Cloudflare',
    },
    metadata: {
      developers: '',
      creationDate: new Date().toISOString().split('T')[0],
      lastModifiedDate: new Date().toISOString().split('T')[0],
      status: 'Planning',
      license: 'MIT',
    },
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate_suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectConfigs }),
      })
      const data: { suggestion: string } = await response.json()
      setSuggestion(data.suggestion)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setIsGenerating(false);
    }
  }

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMoveResize);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={`relative flex flex-col py-14 min-h-screen w-full overflow-hidden ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <AnimatedBackground />
      <FloatingIcons />
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <div className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-md shadow-lg rounded-lg mx-4 mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Zap className="mr-2 text-primary" />
            AI Code Generator
          </h1>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col p-4 w-full h-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8 overflow-visible">
            <CardBody>
              <CodeProjectConfig 
                projectConfigs={projectConfigs} 
                setProjectConfigs={setProjectConfigs}
                generateSuggestions={generateSuggestions}
                isGenerating={isGenerating} 
              />
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1"
        >
          <Card className="h-full min-h-[400px] overflow-visible">
            <CardBody className="h-full">
              <ProjectPrompt 
                projectConfigs={projectConfigs} 
                generating={isGenerating}
                setGenerating={setIsGenerating}
              />
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

