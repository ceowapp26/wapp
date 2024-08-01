'use client';
import React from 'react';
import Link from 'next/link';
import { formatDuration } from '@/utils/formatters';
import { useAppDispatch } from '@/hooks/hooks';
import { playSong } from '@/redux/features/apps/music/deezerSongsSlice';
import FavoriteButton from '../others/FavoriteButton';

const TrackListItem = ({ index, playlist, track: { id, title, duration, artist, album, type } }) => {
    const dispatch = useAppDispatch();
    const formattedDuration = formatDuration(duration);

    return (
        <li
            className='flex p-3 gap-4 items-center rounded-full cursor-pointer transition-background duration-150 ease-out hover:bg-[#0e1a41]'
            onClick={() => dispatch(playSong({ index, playlist }))}
        >
            <img className="w-12 rounded-full" src={album.cover_medium} alt="" />
            <div className='flex flex-1 gap-8 items-center'>
                <div className="flex flex-col flex-1 gap-1">
                    <strong className='overflow-hidden overflow-ellipsis whitespace-nowrap max-w-72 text-truncate text-white'>{title}</strong>
                    <Link
                        href={`/myspace/apps/music/home/artist/${artist.id}`}
                        className='overflow-hidden overflow-ellipsis whitespace-nowrap text-blue-500'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {artist.name}
                    </Link>
                </div>
                <span className="text-white">{formattedDuration}</span>
                <FavoriteButton id={id} type={type} />
            </div>
        </li>
    );
};

export default TrackListItem;
