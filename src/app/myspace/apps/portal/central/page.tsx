"use client"
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, File, Code, Video, Type, Globe, Upload, X } from 'lucide-react';
import { FaYoutube, FaTwitter, FaInstagram, FaGithub, FaDropbox, FaTiktok } from 'react-icons/fa';

const getPlatformIcon = (platform) => {
  switch (platform) {
    case 'YouTube':
      return <FaYoutube className="w-6 h-6 text-red-500" />;
    case 'Twitter':
      return <FaTwitter className="w-6 h-6 text-blue-400" />;
    case 'Instagram':
      return <FaInstagram className="w-6 h-6 text-pink-500" />;
    case 'GitHub':
      return <FaGithub className="w-6 h-6 text-gray-800" />;
    case 'Dropbox':
      return <FaDropbox className="w-6 h-6 text-blue-600" />;
    case 'TikTok':
      return <FaTiktok className="w-6 h-6 text-black" />;
    default:
      return <Globe className="w-6 h-6 text-gray-500" />;
  }
};

const WorkflowStep = ({ title, icon: Icon, isActive, onClick }) => (
  <motion.div
    className={`bg-white p-4 rounded-lg shadow-lg ${isActive ? 'ring-2 ring-blue-500' : ''} cursor-pointer w-40`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <Icon className="w-8 h-8 mb-2 text-blue-500" />
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
  </motion.div>
);

const Connection = ({ index, start, end, isActive }) => {
  return (
    <motion.line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke={isActive ? "#3B82F6" : "#9CA3AF"}
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    />
  );
};

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg p-6 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ResourceToAPIWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedResources, setSelectedResources] = useState([]);
  const [selectedAPIEndpoint, setSelectedAPIEndpoint] = useState(null);
  const [configurations, setConfigurations] = useState({});
  const [uploadStatus, setUploadStatus] = useState('');
  const [output, setOutput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resourceTypes = ['Images', 'Code Files', 'Videos', 'Text Documents'];

  const validExtensions = {
    YouTube: ["mp4", "mov"],
    Twitter: ["jpg", "png", "gif"],
    Instagram: ["jpg", "png"],
    GitHub: ["js", "ts", "tsx"],
    Dropbox: ["pdf", "docx"],
    TikTok: ["mp4", "mov"]
  };

  const checkFilesValid = (platform) => {
    const invalidFiles = selectedResources.filter(resource => {
      const extension = resource.split('.').pop();
      return !validExtensions[platform].includes(extension);
    });

    if (invalidFiles.length > 0) {
      alert(`The following files are not supported on ${platform}: ${invalidFiles.join(', ')}`);
      return false;
    }
    return true;
  };

  const platformApiMap = {
    YouTube: '/api/upload_youtube',
    Twitter: '/api/upload_twitter',
    Instagram: '/api/upload_instagram',
    GitHub: '/api/upload_github',
    Dropbox: '/api/upload_dropbox',
    TikTok: '/api/upload_tiktok'
  };

  const steps = [
    { title: "Select Resources", icon: File },
    { title: "Choose Platform", icon: Globe },
    { title: "Configure Upload", icon: Code },
    { title: "Upload Resources", icon: Upload },
  ];

  const handleStepClick = (index) => {
    setActiveStep(index);
    setIsModalOpen(true);
  };

  const handleResourceSelection = useCallback((resource) => {
    setSelectedResources(prev => 
      prev.includes(resource) ? prev.filter(r => r !== resource) : [...prev, resource]
    );
    setOutput(`Selected resources: ${selectedResources.join(', ')}`);
  }, [selectedResources]);

  const selectAPIEndpoint = useCallback((endpoint) => {
    setSelectedAPIEndpoint(endpoint);
    setOutput(`Selected API endpoint: ${endpoint}`);
  }, []);

  const uploadResources = useCallback(async () => {
    if (!checkFilesValid(selectedAPIEndpoint)) return;

    setUploadStatus('Uploading...');
    try {
      const response = await fetch(selectedAPIEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resources: selectedResources, configurations })
      });
      const result = await response.json();
      setUploadStatus('Upload completed successfully!');
      setOutput(`Resources uploaded to ${selectedAPIEndpoint} successfully!`);
    } catch (error) {
      setUploadStatus('Upload failed.');
      setOutput(`Error uploading resources: ${error.message}`);
    }
  }, [selectedResources, selectedAPIEndpoint, configurations]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderConfigurations = () => {
    switch (selectedAPIEndpoint) {
      case '/api/upload_youtube':
        return (
          <>
            <label>Title</label>
            <input
              type="text"
              value={configurations.title || ''}
              onChange={(e) => setConfigurations({ ...configurations, title: e.target.value })}
              className="w-full p-2 mb-2 border rounded dark:text-gray-100"
            />
            <label>Description</label>
            <textarea
              value={configurations.description || ''}
              onChange={(e) => setConfigurations({ ...configurations, description: e.target.value })}
              className="w-full p-2 mb-2 border rounded dark:text-gray-100"
            />
          </>
        );
      case '/api/upload_github':
        return (
          <>
            <label>Access Key</label>
            <input
              type="text"
              value={configurations.accessKey || ''}
              onChange={(e) => setConfigurations({ ...configurations, accessKey: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <label>Username</label>
            <input
              type="text"
              value={configurations.username || ''}
              onChange={(e) => setConfigurations({ ...configurations, username: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
          </>
        );
      // Add more cases for other platforms as needed
      default:
        return null;
    }
  };

  const renderModalContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div>
            {resourceTypes.map(resource => (
              <button
                key={resource}
                className={`flex items-center w-full text-left p-3 my-2 rounded ${selectedResources.includes(resource) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 dark:text-gray-800'}`}
                onClick={() => handleResourceSelection(resource)}
              >
                {resource === 'Images' && <File className="mr-2" />}
                {resource === 'Code Files' && <Code className="mr-2" />}
                {resource === 'Videos' && <Video className="mr-2" />}
                {resource === 'Text Documents' && <Type className="mr-2" />}
                {resource}
              </button>
            ))}
          </div>
        );
      case 1:
        return (
          <div>
            {Object.entries(platformApiMap).map(([platform, endpoint]) => (
              <button
                key={platform}
                className={`flex items-center w-full text-left p-3 my-2 rounded ${selectedAPIEndpoint === endpoint ? 'bg-blue-100 text-blue-800' : 'dark:text-gray-800 bg-gray-100'}`}
                onClick={() => selectAPIEndpoint(endpoint)}
              >
                {getPlatformIcon(platform)}
                <span className="ml-2">{platform}</span>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div>
            {renderConfigurations()}
          </div>
        );
      case 3:
        return (
          <div>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
              onClick={uploadResources}
            >
              <Upload className="mr-2" />
              Upload Resources
            </button>
            {uploadStatus && (
              <p className="mt-4 text-green-600">{uploadStatus}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 px-8 pt-32 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Resource Publishing Workflow</h1>
      <motion.p
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
        className="overflow-hidden whitespace-nowrap py-4 dark:text-gray-800"
      >
        Connect your resources to API endpoints with ease using our intuitive workflow.
      </motion.p>
      <div className="relative">
        <svg width="100%" height="150" className="absolute top-0 left-0 pointer-events-none">
         {steps.slice(0, -1).map((_, index) => (
            <Connection
              key={index}
              index={index}
              start={{x: `calc((100% - 640px) / 3 * ${index} + 80px + ${index * 160}px)`, y: 75}}
              end={{x: `calc((100% - 640px) / 3 * ${index + 1} + 80px + ${(index + 1) * 160}px)`, y: 75}}
              isActive={activeStep > index}
            />
          ))}
        </svg>
        <div className="flex justify-between mb-8 relative z-10">
          {steps.map((step, index) => (
            <WorkflowStep
              key={index}
              title={step.title}
              icon={step.icon}
              isActive={activeStep === index}
              onClick={() => handleStepClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
          onClick={handlePrev}
          disabled={activeStep === 0}
        >
          Previous Step
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === steps.length - 1 ? 'Upload' : 'Next Step'}
        </button>
      </div>
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 dark:text-gray-800">Output</h2>
        <pre className="bg-gray-100 p-2 rounded dark:text-gray-800">{output}</pre>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={steps[activeStep].title}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default ResourceToAPIWorkflow;