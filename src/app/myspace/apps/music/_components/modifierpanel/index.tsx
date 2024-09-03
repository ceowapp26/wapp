import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import ReactAudioPlayer from "react-audio-player";
import { motion } from "framer-motion";
import { Slider, Switch } from "@nextui-org/react";
import { all, chill, jazzy, sleep } from '@/data/songData';
import {
  selectMoodStatus,
  changeMoodStatus,
} from "@/stores/features/apps/music/moodSlice";
import {
  selectRainStatus,
  changeRainStatus,
} from "@/stores/features/apps/music/rainSlice";
import {
  selectVolumeValues,
  changeVolume,
} from "@/stores/features/apps/music/changeVolumeSlice";
import { playSong } from "@/stores/features/apps/music/songsSlice";
import { Moon, GalleryVerticalEnd, Backpack, CloudMoonRain, Guitar, BoomBox } from 'lucide-react';

const ModifierPanel = () => {
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const moodMode = useAppSelector(selectMoodStatus);
  const rainData = useAppSelector(selectRainStatus);
  const volumeData = useAppSelector(selectVolumeValues);

  const [sounds, setSounds] = useState({
    cityTraffic: 0,
    cityRain: 0,
    fireplace: 0,
    snow: 0,
    summerStorm: 0,
    fan: 0,
    forestNight: 0,
    wave: 0,
    wind: 0,
    people: 0,
    river: 0,
    rainForest: 0,
  });

  const handleSoundChange = (sound, value) => {
    setSounds(prev => ({ ...prev, [sound]: value }));
    if (sound === 'cityRain') {
      dispatch(changeRainStatus({ currentStatus: value > 0 ? "clear" : "rain", value }));
    }
  };

  const moodButtons = [
    { id: "all", icon: GalleryVerticalEnd, label: "All", data: all },
    { id: "sleep", icon: Moon, label: "Sleep", data: sleep },
    { id: "jazzy", icon: Guitar, label: "Jazzy", data: jazzy },
    { id: "chill", icon: BoomBox, label: "Chill", data: chill },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-6">Mood Mixer</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {moodButtons.map(({ id, icon: Icon, label, data }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              dispatch(changeMoodStatus(id));
              dispatch(playSong({ entities: data, activeEntity: index, loop: false, looponce: false }));
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors duration-200 ${
              moodMode === id ? 'bg-violet-600' : 'bg-violet-800 hover:bg-violet-700'
            }`}
          >
            <Icon className="w-8 h-8 mb-2" />
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-4">Background Sounds</h3>
      <div className="space-y-6">
        {Object.entries(sounds).map(([sound, value]) => (
          <motion.div 
            key={sound}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-4"
          >
            <Switch
              checked={value > 0}
              aria-label={sound}
              onChange={() => handleSoundChange(sound, value > 0 ? 0 : 50)}
            />
            <span className="w-32">{sound.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
            <Slider
              size="sm"
              step={1}
              maxValue={100}
              minValue={0}
              value={value}
              onChange={(val) => handleSoundChange(sound, val)}
              className="flex-grow"
              aria-label={sound}
            />
            <ReactAudioPlayer
              preload="auto"
              autoPlay
              src={`/music/audio/effects/${sound}.mp3`}
              loop
              volume={value / 100}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ModifierPanel;