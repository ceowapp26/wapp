"use client"
import React, { useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const StepTarget = ({ className, children }) => (
  <div className={className}>
    {children}
  </div>
);

const tourSteps = [
  {
    target: '.my-first-step', // Class name
    content: 'This is my first step!',
  },
  {
    target: '.my-other-step', // Class name
    content: 'This is my second step!',
  },
  // Add more steps as needed
];

const AppTour = () => {
  const [run, setRun] = useState(false);
  const [steps] = useState(tourSteps);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  return (
    <div className="w-full h-[500px] justify-center items-center">
      <button className="w-20 bg-white text-black" onClick={() => setRun(true)}>Start Tour</button>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <StepTarget className="my-first-step">This is the first step target.</StepTarget>
      <StepTarget className="my-other-step">This is the second step target.</StepTarget>
    </div>
  );
};

export default AppTour;
