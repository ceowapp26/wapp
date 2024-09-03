import React from 'react';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import MicIcon from '@mui/icons-material/Mic';
import RadioIcon from '@mui/icons-material/Radio';
import ReplayIcon from '@mui/icons-material/Replay';
import AlbumIcon from '@mui/icons-material/Album';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FolderIcon from '@mui/icons-material/Folder';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import kanye from '@/assets/music/images/kanye.jpeg';
import dua from '@/assets/music/images/dua.jpeg';
import billie from '@/assets/music/images/billie.jpg';
import nicki from '@/assets/music/images/nicki.jpeg';
import starboy from '@/assets/music/images/starboy.jpg';
import travis from '@/assets/music/images/travis.png';
import ed from '@/assets/music/images/ed.jpeg';

export const links = [
  {
    title: 'Menu',
    links: [
      {
        name: 'Explore',
        url: '/myspace/lib/music/mymusiclib',
        icon: <OfflineBoltIcon />,
      },
      {
        name: 'Genres',
        url: '/myspace/lib/music/toptracks',
        icon: <VolumeDownIcon />,
      },
      {
        name: 'Artists',
        url: '/myspace/lib/music/topartists',
        icon: <MicIcon />,
      },
      {
        name: 'Radio',
        url: '/myspace/lib/music/radio',
        icon: <RadioIcon />,
      },
    ],
  },
  {
    title: 'Library',
    links: [
      {
        name: 'Recent',
        url: '/myspace/lib/music/topartists',
        icon: <ReplayIcon />,
      },
      {
        name: 'Albums',
        url: '/myspace/lib/music/topartists',
        icon: <AlbumIcon />,
      },
      {
        name: 'Favourites',
        url: '/myspace/lib/music/myfavorites',
        icon: <FavoriteIcon />,
      },
      {
        name: 'Local',
        url: '/myspace/lib/music/topartists',
        icon: <FolderIcon />,
      },
    ],
  },
  {
    title: 'Playlist',
    links: [
      {
        name: 'Create New',
        url: '/myspace/lib/music/topartists',
        icon: <AddBoxIcon />,
      },
      {
        name: 'Design Flow',
        url: '/myspace/lib/music/topartists',
        icon: <PlayCircleIcon />,
      },
      {
        name: 'Best of 2020',
        url: '/myspace/lib/music/topartists',
        icon: <PlayCircleIcon />,
      }
    ],
  },
];

export const artists = [
  {
    name: 'Travis Scott',
    count: '44M Plays',
    img: travis,
  },
  {
    name: 'Billie Ellish',
    count: '203M Plays',
    img: billie,
  },
  {
    name: 'Dua Lipa',
    count: '63M Plays',
    img: dua,
  },
  {
    name: 'Kanye',
    count: '15M Plays',
    img: kanye,
  },
  {
    name: 'Nicki Minaj',
    count: '180M Plays',
    img: nicki,
  },
  {
    name: 'Starboy',
    count: '100M Plays',
    img: starboy,
  },
  {
    name: 'Ed Sheeran',
    count: '100M Plays',
    img: ed,
  },
];

export const charts = [
  {
    songName: 'Havana',
    artistName: 'Travis Scott',
    img: travis,
    time: '3:45',
  },
  {
    songName: 'Jesum is king',
    artistName: 'Billie Eilish',
    img: billie,
    time: '3:45',
  },
  {
    songName: 'Closer',
    artistName: 'Dua Lipa',
    img: dua,
    time: '3:45',
  },
  {
    songName: 'Leon On',
    artistName: 'Kanye',
    img: kanye,
    time: '3:45',
  },
];

export const genres = [
  'Dance Beat',
  'Electro Pop',
  'Alternative Indie',
  'Hip Hop',
  'Classical',
  'Hip Hop Rap',
  'Country',
];
