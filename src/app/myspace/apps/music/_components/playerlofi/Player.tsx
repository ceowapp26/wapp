import React, { useEffect, useRef, useState } from 'react';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PlayerControls from './PlayerControls';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import WaveForm from "../waveform";
import { selectCurrentSong } from "@/redux/features/apps/music/songsSlice";
import { useAppSelector } from '@/hooks/hooks';
import Image from 'next/image';

const Player = () => {
  const audioEl = useRef(null);
  const canvaEl = useRef(null);
  const { audioRef, setAudioRef } = useMyspaceContext();
  const currentSong = useAppSelector(selectCurrentSong);
  const [analyzerData, setAnalyzerData] = useState(null);
  const [soundUrl, setSoundUrl] = useState(null);

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
  };

  return (
    <div className="relative bg-black h-full bg-opacity-80 z-11 text-gray-900 flex flex-col items-center justify-center transition duration-100 ease-in-out">
      <div className="bg-black bg-opacity-80 w-full h-full flex flex-col p-4 rounded-3xl sm:flex-col">
        <div className='flex justify-between bg-gray-800 text-white p-2'>
          <p className='text-lg font-medium'>Player</p>
          <div className='cursor-pointer'>
            <QueueMusicIcon />
          </div>
        </div>
        <div ref={canvaEl} className='relative flex items-center top-14'>
          <div 
            style={{
              backgroundImage: `url('/global/images/koan.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '500px'
            }}
          >
            <div className="art absolute top-0">
             <Image
                src={'/music/images/1624_picasso_wired.webp'}
                width={240}
                height={240}
                alt="album art"
                priority
              />
            </div>
            {analyzerData && <WaveForm analyzerData={analyzerData} containerRef={canvaEl.current} />}
          </div>
          <div className='text-3xl'>{currentSong.name}</div>
        </div>
        <div className='relative flex flex-col justify-center h-full max-h-52 bg-black p-4'>
          <PlayerControls audio={audioEl.current} />
          <div className='h-14 text-sm flex items-center justify-center dark:bg-black bg-white rounded-full'>
              <audio ref={audioEl} onPlay={handlePlay} className="w-full" src="" controls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Player);


