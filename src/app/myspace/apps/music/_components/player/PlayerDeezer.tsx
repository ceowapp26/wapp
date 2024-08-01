'use client';
import { useRef } from 'react';
import useWavesurfer from '@/hooks/use-wavesurfer';
import VolumeSlider from './VolumeSlider';
import { formatDuration } from '@/utils/formatters';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { MdSkipPrevious, MdSkipNext, MdPlayArrow, MdPause, MdVolumeUp, MdVolumeMute } from 'react-icons/md';
import { playNextSong, playPreviousSong, selectCurrentSong } from '@/redux/features/apps/music/deezerSongsSlice';

const PlayerDeezer = () => {
    const dispatch = useAppDispatch();
    const waveContainerRef = useRef(null);
    const { album, title, artist, preview: audioSrc, duration } = useAppSelector(selectCurrentSong);
    const { handlePlayPause, isPlaying, setAudioVolume, audioVolume } = useWavesurfer(waveContainerRef, audioSrc, () => dispatch(playNextSong()));
    const formattedDuration = formatDuration(duration);

    return (
        <div className={`flex bg-black items-center px-7 h-16 w-full fixed bottom-0 z-10 ${audioSrc ? '' : 'opacity-50 pointer-events-none'}`}>
            <img className="!audioSrc ? 'hidden' : w-10 h-10 rounded-full mr-5" src={album?.cover_medium} alt='' />

            <div className='flex flex-col justify-center gap-[3px] flex-1'>
                <span className='overflow-ellipsis overflow-hidden whitespace-nowrap text-sm font-bold'>{title}</span>
                <span className='text-xs text-gray-400'>{artist?.name}</span>
            </div>

            <div className='flex items-center gap-2 ml-auto'>
                <button onClick={() => dispatch(playPreviousSong())}>
                    <MdSkipPrevious className="text-white text-2xl" />
                </button>

                <button
                    className='play-pause-btn w-10 h-10 rounded-full flex items-center justify-center bg-blue-600'
                    onClick={audioSrc && handlePlayPause}
                >
                    {isPlaying ? <MdPause className="text-white text-2xl" /> : <MdPlayArrow className="text-white text-2xl" />}
                </button>
                <button onClick={() => dispatch(playNextSong())}>
                    <MdSkipNext className="text-white text-2xl" />
                </button>
            </div>
            <div className='flex-1 relative h-full ml-10 mr-5 w-300 mask-linear-gradient' ref={ waveContainerRef }></div>

            <span className='text-xs'>{formattedDuration}</span>

            <div className='flex items-center gap-2'>
                <button onClick={() => setAudioVolume(prev => ({ ...prev, isMuted: !prev.isMuted }))}>
                    {audioVolume.isMuted ? <MdVolumeMute className="text-white text-2xl" /> : <MdVolumeUp className="text-white text-2xl" />}
                </button>

                {audioSrc &&
                    <VolumeSlider
                        audioVolume={audioVolume}
                        onChange={([value]) => setAudioVolume({ isMuted: value <= 0, value })}
                    />
                }
            </div>
        </div>
    );
};

export default PlayerDeezer;
