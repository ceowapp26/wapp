import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import ReactAudioPlayer from "react-audio-player";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { all, chill, jazzy, sleep } from '@/data/songData';
import {
  selectMoodStatus,
  changeMoodStatus,
} from "@/redux/features/apps/music/moodSlice";
import {
  selectRainStatus,
  changeRainStatus,
} from "@/redux/features/apps/music/rainSlice";
import {
  selectVolumeValues,
  changeVolume,
} from "@/redux/features/apps/music/changeVolumeSlice";
import { playSong } from "@/redux/features/apps/music/songsSlice";
import { Moon, GalleryVerticalEnd, Backpack, CloudMoonRain, Guitar, BoomBox } from 'lucide-react';

const ModifierPanel = ({
  seconds,
  minutes,
  hours,
  isRunning,
  pause,
  resume,
  restart,
  setTimerHandler,
  setTimerStart,
  timerStart,
}) => {
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const [openMood, setOpenMood] = useState(false);
  const [cityTraffic, setCityTraffic] = useState(0);
  const [cityRain, setCityRain] = useState(0);
  const [fireplace, setFireplace] = useState(0);
  const [snow, setSnow] = useState(0);
  const [summerStorm, setSummerStorm] = useState(0);
  const [fan, setFan] = useState(0);
  const [forestNight, setForestNight] = useState(0);
  const [wave, setWave] = useState(0);
  const [wind, setWind] = useState(0);
  const [people, setPeople] = useState(0);
  const [river, setRiver] = useState(0);
  const [rainForest, setRainForest] = useState(0);
  const moodMode = useAppSelector(selectMoodStatus);
  const rainData = useAppSelector(selectRainStatus);
  const volumeData = useAppSelector(selectVolumeValues);
  const rainValue = rainData;
  const rainSliderHandler = (e) => {
    const { value } = e.target;
    if (value > 0) {
      dispatch(changeRainStatus({ currentStatus: "clear", value: cityRain }));
    } else if (value === 0) {
      dispatch(changeRainStatus({ currentStatus: "rain", value: 0 }));
    }
    setCityRain(value);
  };

  const openFocusHandler = () => {
    setOpenFocus(!openFocus);
    setOpenMood(false);
  };

  const openMoodHandler = () => {
    setOpenMood(!openMood);
    setOpenFocus(false);
  };

  const changeMoodHandler = (e) => {
    dispatch(changeMoodStatus(e.target.id));
  };

  const changeVolumeHandler = (e) => {
    dispatch(changeVolume(e.target.value));
  };


  return (
    <div className="relative bg-black bg-opacity-80 z-11 text-gray-900 flex flex-col items-center justify-center transition duration-100 ease-in-out">
      <div className="bg-black bg-opacity-80 w-full h-full flex flex-col p-4 rounded-3xl sm:flex-col">
        <h4>Mood</h4>
          <div style={{}}className="flex flex-wrap justify-between max-sm:flex-col md:flex-row lg:flex-row xl:flex-row items-center">
          <div
            id="all"
            onClick={(e) => {
              changeMoodHandler(e);
              dispatch(
                playSong({
                  entities: all,
                  activeEntity: index,
                  loop: false,
                  looponce: false,
                })
              );
            }}
            className={`flex w-1/4 items-center justify-center ${
              moodMode === "all" ? "active" : ""
            }`}
          >
            <a className="flex flex-col p-4 w-full max-w-20 rounded-xl bg-violet-500 items-center space-y-2">
              <GalleryVerticalEnd className="text-white"/>
              <span className="text-white">All</span>
            </a>
          </div>
          <div
            id="sleep"
            onClick={(e) => {
              changeMoodHandler(e);
              dispatch(
                playSong({
                  entities: sleep,
                  activeEntity: index,
                  loop: false,
                  looponce: false,
                })
              );
            }}
            className={`flex w-1/4 items-center justify-center ${
              moodMode === "sleep" ? "active" : ""
            }`}
          >
            <a className="flex flex-col p-4 w-full max-w-20 rounded-xl bg-violet-500 items-center space-y-2">
              <Moon className="text-white"/>
              <span className="text-white">Sleep</span>
            </a>
          </div>
          <div
            id="jazzy"
            onClick={(e) => {
              changeMoodHandler(e);
              dispatch(
                playSong({
                  entities: jazzy,
                  activeEntity: index,
                  loop: false,
                  looponce: false,
                })
              );
            }}
            className={`flex w-1/4 items-center justify-center ${
              moodMode === "jazzy" ? "active" : ""
            }`}
          >
            <a className="flex flex-col p-4 w-full max-w-20 rounded-xl bg-violet-500 items-center space-y-2">
              <Guitar className="text-white"/>
              <span className="text-white">Jazzy</span>
            </a>
          </div>
          <div
            id="chill"
            onClick={(e) => {
              changeMoodHandler(e);
              dispatch(
                playSong({
                  entities: chill,
                  activeEntity: index,
                  loop: false,
                  looponce: false,
                })
              );
            }}
            className={`flex w-1/4 items-center justify-center ${
              moodMode === "chill" ? "active" : ""
            }`}
          >
            <a className="flex flex-col p-4 w-full max-w-20 rounded-xl bg-violet-500 items-center space-y-2">
              <BoomBox className="text-white"/>
              <span className="text-white">Chill</span>
            </a>
          </div>
        </div>
        <h5 className="text-md pt-10 pb-4 font-bold text-violet-600">BACKGROUND NOISE</h5>
        <div className="flex flex-col overflow-y-auto scrollbar-none">
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">City traffic</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src="../../../music/audio/effects/city_traffic.mp3"
              loop
              volume={cityTraffic / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={cityTraffic}
              onChange={(e) => setCityTraffic(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">City rain</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src="../../../music/audio/effects/rain_city.mp3"
              loop
              volume={rainValue / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={rainValue}
              onChange={rainSliderHandler}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">Fireplace</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src="../../../music/audio/effects/fireplace.mp3"
              loop
              volume={fireplace / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={fireplace}
              onChange={(e) => setFireplace(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">Snow</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/snow.mp3'
              loop
              volume={snow / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={snow}
              onChange={(e) => setSnow(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">Summer Storm</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/summer_storm.mp3'
              loop
              volume={summerStorm / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={summerStorm}
              onChange={(e) => setSummerStorm(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">Fan</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/fan.mp3'
              loop
              volume={fan / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={fan}
              onChange={(e) => setFan(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">Forest Night</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/forest_night.mp3'
              loop
              volume={forestNight / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={forestNight}
              onChange={(e) => setForestNight(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">Wave</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/waves.mp3'
              loop
              volume={wave / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={wave}
              onChange={(e) => setWave(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">Wind</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/wind.mp3'
              loop
              volume={wind / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={wind}
              onChange={(e) => setWind(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">People</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/people_talk_inside.mp3'
              loop
              volume={people / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">River</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/river.mp3'
              loop
              volume={river / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={river}
              onChange={(e) => setRiver(e.target.value)}
            />
          </div>
          <div className="p-2 flex items-center justify-between">
            <p className="mb-0 text-white w-full">Rain Forest</p>
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src='../../../music/audio/effects/rain_forest.mp3'
              loop
              volume={rainForest / 100}
            />
            <Slider
              sx={{
                width: 300,
                height: 10,
                color: '#f3a952',
              }}
              value={rainForest}
              onChange={(e) => setRainForest(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierPanel;        

