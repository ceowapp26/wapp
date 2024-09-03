"use client"
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Database, Cog, Brain, PlayCircle, Save, X } from 'lucide-react';

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

const MLTrainingWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [processedDatasets, setProcessedDatasets] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedArchitecture, setSelectedArchitecture] = useState(null);
  const [trainingResult, setTrainingResult] = useState(null);
  const [output, setOutput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const datasets = ['Dataset A', 'Dataset B', 'Dataset C'];
  const models = ['Model X', 'Model Y', 'Model Z'];
  const architectures = ['Architecture 1', 'Architecture 2', 'Architecture 3'];

  const steps = [
    { title: "Select Datasets", icon: Database },
    { title: "Process Datasets", icon: Cog },
    { title: "Select Model", icon: Brain },
    { title: "Select Architecture", icon: ArrowRight },
    { title: "Train Model", icon: PlayCircle },
    { title: "Save Model", icon: Save },
  ];

  const handleStepClick = (index) => {
    setActiveStep(index);
    setIsModalOpen(true);
  };

  const handleDatasetSelection = useCallback((dataset) => {
    setSelectedDatasets(prev => 
      prev.includes(dataset) ? prev.filter(d => d !== dataset) : [...prev, dataset]
    );
    setOutput(`Selected datasets: ${selectedDatasets.join(', ')}`);
  }, [selectedDatasets]);

  const processDatasets = useCallback(() => {
    setProcessedDatasets(selectedDatasets.map(d => `Processed ${d}`));
    setOutput(`Processed datasets: ${processedDatasets.join(', ')}`);
  }, [selectedDatasets, processedDatasets]);

  const selectModel = useCallback((model) => {
    setSelectedModel(model);
    setOutput(`Selected model: ${model}`);
  }, []);

  const selectArchitecture = useCallback((architecture) => {
    setSelectedArchitecture(architecture);
    setOutput(`Selected architecture: ${architecture}`);
  }, []);

  const startTraining = useCallback(() => {
    setTrainingResult('Training completed successfully!');
    setOutput('Training completed successfully!');
  }, []);

  const saveModel = useCallback(() => {
    setOutput('Model saved successfully!');
  }, []);

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

  const renderModalContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div>
            {datasets.map(dataset => (
              <button
                key={dataset}
                className={`block w-full text-left p-2 my-1 rounded ${selectedDatasets.includes(dataset) ? 'bg-blue-100 text-blue-800' : 'dark:text-gray-800 bg-gray-100'}`}
                onClick={() => handleDatasetSelection(dataset)}
              >
                {dataset}
              </button>
            ))}
          </div>
        );
      case 1:
        return (
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={processDatasets}>
              Process Datasets
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            {models.map(model => (
              <button
                key={model}
                className={`block w-full text-left p-2 my-1 rounded ${selectedModel === model ? 'bg-blue-100 text-blue-800' : 'dark:text-gray-800 bg-gray-100'}`}
                onClick={() => selectModel(model)}
              >
                {model}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            {architectures.map(architecture => (
              <button
                key={architecture}
                className={`block w-full text-left p-2 my-1 rounded ${selectedArchitecture === architecture ? 'bg-blue-100 text-blue-800' : 'dark:text-gray-800 bg-gray-100'}`}
                onClick={() => selectArchitecture(architecture)}
              >
                {architecture}
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={startTraining}>
              Start Training
            </button>
          </div>
        );
      case 5:
        return (
          <div>
            <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={saveModel}>
              Save Model
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 px-8 pt-32 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ML Training Workflow</h1>
      <motion.p
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
        className="overflow-hidden whitespace-nowrap py-4 dark:text-gray-800"
      >
        Train AI model with ease with simple workflow steps.
      </motion.p>
      <div className="relative">
        <svg width="100%" height="150" className="absolute top-0 left-0 pointer-events-none">
         {steps.slice(0, -1).map((_, index) => (
            <Connection
              key={index}
              index={index}
              start={{x: `calc((100% - 960px) / 5 * ${index} + 80px + ${index * 160}px)`, y: 75}}
              end={{x: `calc((100% - 960px) / 5 * ${index + 1} + 80px + ${(index + 1) * 160}px)`, y: 75}}
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
          Next Step
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

export default MLTrainingWorkflow;
