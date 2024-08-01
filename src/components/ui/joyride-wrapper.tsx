import React, { useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface JoyrideWrapperProps {
  steps: Step[];
  startTourButtonLabel?: string;
  className?: string;
}

const JoyrideWrapper: React.FC<JoyrideWrapperProps> = ({
  steps,
  startTourButtonLabel = 'Start Tour',
  className = '',
}) => {
  const [run, setRun] = useState(false);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  const handleStartTour = () => {
    setRun(true);
  };

  return (
    <div className={`z-[100] flex w-full h-full justify-center items-center ${className}`}>
      <button className="w-32 bg-violet-600 text-white" onClick={handleStartTour}>
        {startTourButtonLabel}
      </button>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showProgress={false}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 100000,
          },
        }}
      />
    </div>
  );
};

export default JoyrideWrapper;
