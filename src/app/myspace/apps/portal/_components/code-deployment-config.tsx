import React from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Tabs,
  Tab,
  Progress,
} from "@nextui-org/react";
import { Settings, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeploymentConfigProps {
  isOpen: boolean;
  onClose: () => void;
  configs: any;
  setConfigs: (configs: any) => void;
}

const CodeDeploymentConfig: React.FC<DeploymentConfigProps> = ({ isOpen, onClose, configs, setConfigs }) => {
  const [activeTab, setActiveTab] = React.useState('general');

  const updateConfig = (key: string, value: any) => {
    setConfigs(prevConfig => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  const renderInput = (key: string, placeholder: string) => (
    <Input
      label={placeholder}
      placeholder={placeholder}
      value={configs[key]}
      onChange={(e) => updateConfig(key, e.target.value)}
      className="w-full"
    />
  );

  const calculateProgress = () => {
    const totalFields = Object.keys(configs).length;
    const filledFields = Object.values(configs).filter(value => value !== '').length;
    return (filledFields / totalFields) * 100;
  };

  const tabContent = {
    general: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderInput('projectId', 'Project ID')}
          {renderInput('GITHUB_TOKEN', 'GitHub Token')}
          {renderInput('GITHUB_USERNAME', 'GitHub Username')}
          {renderInput('VERCEL_TOKEN', 'Vercel Token')}
        </div>
      </motion.div>
    ),
    git: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderInput('commitMessage', 'Commit Message')}
          {renderInput('branch', 'Branch')}
        </div>
      </motion.div>
    ),
    vercel: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderInput('framework', 'Framework')}
          {renderInput('buildCommand', 'Build Command')}
          {renderInput('devCommand', 'Dev Command')}
          {renderInput('installCommand', 'Install Command')}
          {renderInput('outputDirectory', 'Output Directory')}
          {renderInput('nodeVersion', 'Node Version')}
          {renderInput('maxBuildAttempts', 'Max Build Attempts')}
        </div>
      </motion.div>
    ),
  };

  return (
    <Modal
      size="3xl"
      scrollBehavior="inside"
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        wrapper: "z-[999999]",
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">Deployment Configuration</h3>
              <Progress
                aria-label="Configuration progress"
                size="sm"
                value={calculateProgress()}
                className="max-w-md"
                color="success"
              />
            </ModalHeader>
            <ModalBody>
              <Tabs 
                aria-label="Deployment Configuration Tabs"
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key.toString())}
              >
                <Tab key="general" title="General" />
                <Tab key="git" title="Git" />
                <Tab key="vercel" title="Vercel" />
              </Tabs>
              <AnimatePresence mode="wait">
                {tabContent[activeTab]}
              </AnimatePresence>
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="danger" onPress={onClose} startContent={<X size={18} />}>
                Close
              </Button>
              <Button auto color="success" onPress={onClose} startContent={<Save size={18} />}>
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CodeDeploymentConfig;
