import React from 'react';
import { Button, Tooltip } from "@nextui-org/react";
import { Play, Square, StepForward, Bug } from 'lucide-react';

interface DebugControlButtonsProps {
  handleStartDebugging: () => void;
  isDebugging: boolean;
  handleStopDebugging: () => void;
  handleStepOver: () => void;
}

const DebugControlButtons: React.FC<DebugControlButtonsProps> = ({
  handleStartDebugging,
  isDebugging,
  handleStopDebugging,
  handleStepOver
}) => {
  return (
    <div className="debug-controls flex space-x-2">
      <Tooltip content={isDebugging ? "Debugging in progress" : "Start Debugging"}>
        <Button
          isIconOnly
          color="success"
          variant="ghost"
          onClick={handleStartDebugging}
          disabled={isDebugging}
        >
          <Play size={18} />
        </Button>
      </Tooltip>
      <Tooltip content="Stop Debugging">
        <Button
          isIconOnly
          color="danger"
          variant="ghost"
          onClick={handleStopDebugging}
          disabled={!isDebugging}
        >
          <Square size={18} />
        </Button>
      </Tooltip>
      <Tooltip content="Step Over (Ctrl+D)">
        <Button
          isIconOnly
          color="primary"
          variant="ghost"
          onClick={handleStepOver}
          disabled={!isDebugging}
        >
          <StepForward size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default DebugControlButtons;
