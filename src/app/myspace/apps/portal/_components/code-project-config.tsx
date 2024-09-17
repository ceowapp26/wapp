import React from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownTrigger, 
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardBody,
  useDisclosure,
  Input,
  Checkbox,
  Tabs,
  Tab,
  Progress,
  Textarea,
} from "@nextui-org/react";
import { Settings, HelpCircle, Save, X, ChevronDown, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelSelector from "./model-selector";
import { PROJECT_CONFIG_OPTIONS } from '@/constants/code';

interface CodeProjectConfigProps {
  projectConfigs: any;
  setProjectConfigs: (configs: any) => void;
  isGenerating: boolean;
  generateSuggestions: () => void;
}

const CodeProjectConfig: React.FC<CodeProjectConfigProps> = ({ projectConfigs, setProjectConfigs, generateSuggestions, isGenerating }) => {
  const projectConfigModal = useDisclosure();
  const [activeTab, setActiveTab] = React.useState('general');

  const updateConfig = (category: string, key: string, value: any) => {
    setProjectConfigs(prevConfig => ({
      ...prevConfig,
      [category]: {
        ...prevConfig[category],
        [key]: value,
      },
    }));
  };

  const renderDropdown = (category, key) => (
    <Dropdown>
      <DropdownTrigger>
        <Button
          flat
          color="primary"
          className="w-full justify-between"
          endContent={<ChevronDown className="text-small" />}
        >
          {projectConfigs[category][key]}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label={`${key} selection`}
        selectionMode="single" 
        selectedKeys={[projectConfigs[category][key]]} 
        onSelectionChange={(keys) => updateConfig(category, key, Array.from(keys)[0])}
      >
        {PROJECT_CONFIG_OPTIONS[category][key].map((option) => (
          <DropdownItem key={option}>{option}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  const renderInput = (category, key, placeholder) => (
    <Input
      label={placeholder}
      placeholder={placeholder}
      value={projectConfigs[category][key]}
      onChange={(e) => updateConfig(category, key, e.target.value)}
      className="w-full"
    />
  );

  const renderDateInput = (category, key, label) => (
    <Input
      type="date"
      label={label}
      value={projectConfigs[category][key]}
      onChange={(e) => updateConfig(category, key, e.target.value)}
      className="w-full"
    />
  );

  const renderTextarea = (category, key, placeholder) => (
    <Textarea
      label={placeholder}
      placeholder={placeholder}
      value={projectConfigs[category][key]}
      onChange={(e) => updateConfig(category, key, e.target.value)}
      className="w-full"
    />
  );

  const calculateProgress = () => {
    const totalFields = Object.values(projectConfigs).reduce((acc, category) => acc + Object.keys(category).length, 0);
    const filledFields = Object.values(projectConfigs).reduce((acc, category) => 
      acc + Object.values(category).filter(value => 
        value !== '' && value !== false && (Array.isArray(value) ? value.length > 0 : true)
      ).length, 0);
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
          {renderInput('general', 'projectName', 'Project Name')}
          {renderDropdown('general', 'projectType')}
          {renderInput('general', 'version', 'Version')}
          {renderInput('general', 'description', 'Description')}
        </div>
      </motion.div>
    ),
    development: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderDropdown('development', 'language')}
          {renderDropdown('development', 'framework')}
          {renderDropdown('development', 'buildTool')}
          {renderDropdown('development', 'packageManager')}
        </div>
      </motion.div>
    ),
    testing: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderDropdown('testing', 'framework')}
          {renderDropdown('testing', 'e2eFramework')}
        </div>
      </motion.div>
    ),
    database: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderDropdown('database', 'type')}
          {renderDropdown('database', 'name')}
          {renderDropdown('database', 'orm')}
        </div>
      </motion.div>
    ),
    deployment: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderDropdown('deployment', 'platform')}
          {renderDropdown('deployment', 'cicdTool')}
          {renderDropdown('deployment', 'containerization')}
        </div>
      </motion.div>
    ),
    security: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderDropdown('security', 'authentication')}
          {renderDropdown('security', 'authorization')}
          <Checkbox
            isSelected={projectConfigs.security.dataEncryption}
            onChange={(isSelected) => updateConfig('security', 'dataEncryption', isSelected)}
          >
            Data Encryption
          </Checkbox>
        </div>
      </motion.div>
    ),
    performance: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderDropdown('performance', 'caching')}
          {renderDropdown('performance', 'cdn')}
        </div>
      </motion.div>
    ),
    metadata: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          {renderTextarea('metadata', 'developers', 'Developers (comma-separated)')}
          {renderDateInput('metadata', 'creationDate', 'Creation Date')}
          {renderDateInput('metadata', 'lastModifiedDate', 'Last Modified Date')}
          {renderDropdown('metadata', 'status')}
          {renderDropdown('metadata', 'license')}
        </div>
      </motion.div>
    ),
  };

  return (
   <div className="p-4">
      <div className="flex justify-between items-center mb-4 pr-24"> 
        <div className="flex space-x-2">
          <Button auto color="primary" onPress={projectConfigModal.onOpen}>
            <Settings size={18} />
            Config
          </Button>
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button auto color="secondary">
                <Wrench size={18} />
                Tools
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Card>
                <CardBody className="flex flex-col max-w-64">
                  <Button 
                    onClick={generateSuggestions}
                    className="mt-4"
                    isLoading={isGenerating}
                  >
                    Generate Suggestions
                  </Button>
                </CardBody>
              </Card>
            </PopoverContent>
          </Popover>
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button auto color="secondary">
                <HelpCircle size={18} />
                Help
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Card>
                <CardBody className="flex flex-col max-w-64">
                  <p className="text-sm">
                    Configure your project settings here. Click on the Config button to open the configuration modal.
                    You can set up various aspects of your project including general settings, development environment,
                    testing, database, deployment, security, performance, and metadata.
                  </p>
                </CardBody>
              </Card>
            </PopoverContent>
          </Popover>
        </div>
        <ModelSelector />
      </div>      
      <Modal
        size="3xl"
        scrollBehavior="inside"
        isOpen={projectConfigModal.isOpen}
        onOpenChange={projectConfigModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">Project Configuration</h3>
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
                  aria-label="Project Configuration Tabs"
                  selectedKey={activeTab}
                  onSelectionChange={setActiveTab}
                >
                  <Tab key="general" title="General" />
                  <Tab key="development" title="Development" />
                  <Tab key="testing" title="Testing" />
                  <Tab key="database" title="Database" />
                  <Tab key="deployment" title="Deployment" />
                  <Tab key="security" title="Security" />
                  <Tab key="performance" title="Performance" />
                  <Tab key="metadata" title="Metadata" />
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
    </div>
  );
};

export default CodeProjectConfig;


