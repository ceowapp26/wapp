"use client";
import React, { useState } from "react";
import { useTimer } from "react-timer-hook";
import ModifierPanel from "../modifierpanel";
import Player from '../playerlofi/Player';

const FeatureContainer = () => {
  const [timerStart, setTimerStart] = useState(false);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 0);

  const { seconds, minutes, hours, isRunning, pause, resume, restart } =
    useTimer({
      expiryTimestamp,
      onExpire: () => setTimerStart(false),
    });

  const setTimerHandler = (hour, minute, second) => {
    const time = new Date();
    const setupTimer = Number(hour) * 3600 + Number(second) + Number(minute) * 60;
    time.setSeconds(time.getSeconds() + setupTimer);
    restart(time.getTime());
  };

  return (
    <div className="relative flex laptop:flex-col flex-row p-2 w-full flex-wrap left-[2px]">
      <div className="bg-gray-200 p-4 laptop:w-full w-1/2 flex-1 flex-grow">
        <Player />
      </div>
      <div className="bg-gray-200 p-4 laptop:w-full w-1/2 flex-1 flex-grow">
        <ModifierPanel
          seconds={seconds}
          minutes={minutes}
          hours={hours}
          isRunning={isRunning}
          pause={pause}
          resume={resume}
          restart={restart}
          setTimerHandler={setTimerHandler}
          setTimerStart={setTimerStart}
          timerStart={timerStart}
        />
      </div>
    </div>
  );
};

export default FeatureContainer;

