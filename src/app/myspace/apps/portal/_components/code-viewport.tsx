import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, AlertTriangle, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ViewportProps {
  deploymentStatus: {
    upload: string;
    deploy: string;
    build: string;
    step: number;
  };
  deploymentUrl: string;
  deploymentError: string;
  isCompiling: boolean;
  runAllCode: () => void;
}

const Connection = ({ start, end, isActive, progress }) => {
  return (
    <svg className="absolute top-1/2 left-0 w-full h-4" style={{ transform: 'translateY(-50%)' }}>
      <line
        x1={start}
        y1="50%"
        x2={end}
        y2="50%"
        stroke="#E5E7EB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <motion.line
        x1={start}
        y1="50%"
        x2={end}
        y2="50%"
        stroke="#3B82F6"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isActive ? progress : 0 }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    case 'failed':
      return <XCircle className="w-8 h-8 text-red-500" />;
    default:
      return <Loader className="w-8 h-8 text-blue-500 animate-spin" />;
  }
};

const Viewport: React.FC<ViewportProps> = ({ deploymentStatus, deploymentUrl, deploymentError, isCompiling, runAllCode }) => {
  const statusSteps = ['upload', 'deploy', 'build'];
  const stepRefs = useRef([]);
  const [expandedStep, setExpandedStep] = useState(null);

  const getStepProgress = (index) => {
    if (deploymentStatus.step > index) return 1;
    if (deploymentStatus.step === index) {
      return ['success', 'failed'].includes(deploymentStatus[statusSteps[index]]) ? 1 : 0.5;
    }
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Deployment Status</h2>
      <div className="relative mb-12">
        <div className="flex justify-between mb-2">
          {statusSteps.map((step, index) => (
            <motion.div
              key={step}
              ref={el => stepRefs.current[index] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center relative z-10"
            >
              <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                <StatusIcon status={deploymentStatus[step]} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-sm font-medium"
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                {step.toUpperCase()}
                {expandedStep === index ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
              </Button>
            </motion.div>
          ))}
        </div>
        {statusSteps.map((_, index) => (
          index < statusSteps.length - 1 && (
            <Connection
              key={index}
              start={stepRefs.current[index]?.offsetLeft + 24}
              end={stepRefs.current[index + 1]?.offsetLeft + 24}
              isActive={deploymentStatus.step > index}
              progress={getStepProgress(index)}
            />
          )
        ))}
      </div>
      <AnimatePresence>
        {expandedStep !== null && (
          <motion.div
            key={expandedStep}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">{statusSteps[expandedStep].toUpperCase()}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Status: <span className="font-medium capitalize">{deploymentStatus[statusSteps[expandedStep]]}</span>
            </p>
            <Progress value={getStepProgress(expandedStep) * 100} className="mt-2" />
          </motion.div>
        )}
      </AnimatePresence>
      {deploymentError && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{deploymentError}</AlertDescription>
        </Alert>
      )}
      {deploymentUrl && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Deployed Application</h3>
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md">
            <iframe
              src={deploymentUrl}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <Button className="mt-4" variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in new tab
          </Button>
        </motion.div>
      )}
      <Button 
        onClick={runAllCode}
        className="mt-4 w-full"
        isLoading={isCompiling}
      >
        {isCompiling ? 'Compiling and Deploying...' : 'Run All Code and Deploy'}
      </Button>
    </motion.div>
  );
};

export default Viewport;