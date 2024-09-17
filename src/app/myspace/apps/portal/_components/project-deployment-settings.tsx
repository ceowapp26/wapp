import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { motion } from 'framer-motion';
import Viewport from './code-viewport';
import { useQuery, useMutation } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import CodeDeploymentConfig from './code-deployment-config';

const ProjectDeploymentSettings = () => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState({
    push: 'pending',
    deploy: 'pending',
    build: 'pending',
    step: 0
  });
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [deploymentError, setDeploymentError] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [deploymentConfigs, setDeploymentConfigs] = useState({
    GITHUB_TOKEN: '',
    GITHUB_USERNAME: '',
    VERCEL_TOKEN: '',
    projectId: '',
    commitMessage: '',
    branch: 'main',
    framework: 'nextjs',
    buildCommand: '',
    devCommand: '',
    installCommand: '',
    outputDirectory: '',
    nodeVersion: '20.x',
    maxBuildAttempts: 60
  });

  const getProject = useMutation(api.codes.getProject);
  
  const runAllCode = async () => {
    setIsCompiling(true);
    const project = await getProject.mutateAsync({ projectId: deploymentConfigs.projectId });
    try {
      const response = await fetch('/api/compile_and_deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectStructure: project.structure,
          configurations: deploymentConfigs 
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setDeploymentStatus({
        push: 'pending',
        deploy: 'pending',
        build: 'pending',
        step: 0
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const decodedChunk = decoder.decode(value, { stream: true });
        const lines = decodedChunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          const data = JSON.parse(line);          
          setDeploymentStatus(prevStatus => {
            let newStep = prevStatus.step;
            if (data.step === 'push' && data.status === 'success') newStep = 1;
            if (data.step === 'deploy' && data.status === 'success') newStep = 2;
            if (data.step === 'build' && data.status === 'success') newStep = 3;
            return { 
              ...prevStatus, 
              [data.step]: data.status,
              step: newStep
            };
          });
          if (data.step === 'build' && data.status === 'success') {
            setDeploymentUrl(data.deploymentUrl);
          }
          if (data.error) {
            setDeploymentError(data.error);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error compiling and running code:', error);
      setDeploymentError(error.message);
    } finally {
      setIsCompiling(false);
    }
  };  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Button onClick={() => setIsConfigOpen(true)}>
        Deployment Config
      </Button>
      <CodeDeploymentConfig 
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        configs={deploymentConfigs}
        setConfigs={setDeploymentConfigs}
      />
      <Viewport 
        deploymentStatus={deploymentStatus} 
        deploymentUrl={deploymentUrl} 
        deploymentError={deploymentError}
        isCompiling={isCompiling}
        runAllCode={runAllCode}
      />
    </motion.div>
  );
};

export default ProjectDeploymentSettings;