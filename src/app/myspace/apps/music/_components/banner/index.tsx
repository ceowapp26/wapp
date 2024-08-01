"use client";
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { selectMoodStatus, changeMoodStatus } from '@/redux/features/apps/music/moodSlice';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { all } from '@/data/songData';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import SampleImage from '/public/music/images/default_player_image.png';
import { playSong } from '@/redux/features/apps/music/songsSlice';
import Image from 'next/image';

const Banner = () => {
  const { moodMode } = useAppSelector(selectMoodStatus);
  const [index, setIndex] = useState(0);
  const [songName, setSongName] = useState(''); 
  const [artist, setArtist] = useState('');
  const [img, setImg] = useState('');
  const [noOfPlays, setNoOfPlays] = useState(0);
  const { setcurrentSong } = useMyspaceContext();
  const dispatch = useAppDispatch();
  const noOfSongs = all.length;
  useEffect(() => {
    const dots = document.getElementsByClassName('trend-circle');
    for (let x = 0; x < dots.length; x++) {
      dots[x].classList.remove('bg-gray-600');
      dots[x].classList.add('bg-gray-100');
    }
    dots[index]?.classList.remove('bg-gray-100');
    dots[index]?.classList.add('bg-gray-600');
    setSongName(all[index]?.title || '');
    setArtist(all[index]?.artist || '');
    setImg(all[index]?.img || '');
    setNoOfPlays(all[index]?.noOfPlays || 20);
  }, [index, all, setArtist]);

  const selectSongHandler = (song) => {
    setcurrentSong((prev) => ({
      ...prev,
      ...song,
      image: song.img ? song.img : SampleImage,
    }));
  };

  const changeMoodHandler = () => {
    dispatch(changeMoodStatus("all"));
  };

  return (
    <div className='relative h-full bg-gradient-x bg-gradient-y mx-2'>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div className='relative z-10 flex items-center justify-center p-6 h-full'>
        <div className='flex flex-col md:flex-row gap-12 w-full max-w-6xl'>
          <div className='flex-1 flex flex-col justify-center'>
            <h1 className='text-5xl md:text-7xl font-extrabold text-white mb-4 animate-fade-in-up'>
              {songName}
            </h1>
            <div className='mb-8'>
              <h2 className="text-2xl text-white font-bold mb-2">Amazing Playlists</h2>
              <p className="text-lg text-gray-300">Listen to the best playlists curated by us and our users.</p>
            </div>
            <button
              className='bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg py-3 px-8 rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center'
              onClick={() => {
                selectSongHandler({
                  title: songName,
                  artist: artist,
                  img: img,
                });
                dispatch(playSong({ entities: all, activeEntity: index, loop: false, looponce: false }));
              }}
            >
              <PlayArrowIcon className="mr-2" />
              Listen Now
            </button>
          </div>
          <div className='flex-1 flex items-center justify-center'>
            <div className='relative w-64 h-64 md:w-80 md:h-80'>
              <Image
                src={img || SampleImage}
                alt={songName}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;