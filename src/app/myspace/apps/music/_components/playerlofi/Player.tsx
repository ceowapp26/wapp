"use client"
import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PlayerControls from './PlayerControls';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import WaveForm from "../waveform";
import { selectCurrentSong } from "@/stores/features/apps/music/songsSlice";
import { useAppSelector } from '@/hooks/hooks';
import Image from 'next/image';
import { IconButton, Slider, Typography } from '@mui/material';

const Player = () => {
  const audioEl = useRef(null);
  const canvaEl = useRef(null);
  const { audioRef, setAudioRef } = useMyspaceContext();
  const currentSong = useAppSelector(selectCurrentSong);
  const [analyzerData, setAnalyzerData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { homePlayerToggle, setHomePlayerToggle } = useMyspaceContext();

  useEffect(() => {
    if (!audioRef) {
      setAudioRef(audioEl);
    }
  }, [audioRef, setAudioRef]);

  const handlePlay = () => {
    if (!audioEl.current.mediaElementSourceNode) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 2048;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const source = audioCtx.createMediaElementSource(audioEl.current);

      audioEl.current.mediaElementSourceNode = source;

      source.connect(analyzer);
      source.connect(audioCtx.destination);
      source.onended = () => {
        source.disconnect();
      };

      setAnalyzerData({ analyzer, bufferLength, dataArray });
    }
    setHomePlayerToggle(true);
  };

  const handlePause = () => {
    setHomePlayerToggle(false);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioEl.current.currentTime);
    setDuration(audioEl.current.duration);
  };

  const handleSeek = (_, newValue) => {
    audioEl.current.currentTime = newValue;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <motion.div 
      className="relative bg-gradient-to-b from-gray-900 to-black h-full z-11 text-white flex flex-col items-center justify-center transition duration-100 ease-in-out rounded-lg shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-max flex flex-col py-2 px-4 rounded-3xl sm:flex-col">
        <div className='flex justify-between items-center bg-gray-800 text-white p-4 rounded-t-lg'>
          <Typography variant="h6" className='font-medium'>Now Playing</Typography>
          <IconButton color="primary">
            <QueueMusicIcon />
          </IconButton>
        </div>
        <div ref={canvaEl} className='relative flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-gray-900'>
          <motion.div 
            className="art mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
           <Image
              src={'/music/images/1624_picasso_wired.webp'}
              width={300}
              height={300}
              alt="album art"
              priority
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
          <Typography variant="h4" className='mb-2 text-center'>{currentSong.name}</Typography>
          <Typography variant="subtitle1" className='mb-4 text-center text-gray-400'>{currentSong.artist}</Typography>
          {analyzerData && <WaveForm analyzerData={analyzerData} containerRef={canvaEl.current} />}
        </div>
        <div className='relative flex flex-col justify-center bg-gray-900 p-4 rounded-b-lg'>
          <Slider
            value={0}
            max={100}
            onChange={handleSeek}
            aria-labelledby="continuous-slider"
            className="mb-2"
          />
          <div className="flex justify-between mb-4">
            <Typography variant="caption">{formatTime(currentTime)}</Typography>
            <Typography variant="caption">{formatTime(duration)}</Typography>
          </div>
          <PlayerControls 
            audio={audioEl.current} 
            onPlay={() => audioEl.current.play()}
            onPause={() => audioEl.current.pause()}
          />
          <audio 
            ref={audioEl} 
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            className="w-full mt-4" 
            src={currentSong.preview} 
            controls 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(Player);