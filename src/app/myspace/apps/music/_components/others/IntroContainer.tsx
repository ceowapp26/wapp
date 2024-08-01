'use client';
import { playSong } from '@/redux/features/apps/music/deezerSongsSlice';
import { FaPlay } from 'react-icons/fa';
import FavoriteButton from './FavoriteButton';
import { useAppDispatch } from '@/hooks/hooks';

const IntroContainer = ({ id, imgSrc, title, description, playlist, type }) => {
    const dispatch = useAppDispatch();

    return (
        <div className='intro-container flex items-center gap-8'>
            <img src={ imgSrc } alt="" className="w-40 h-40 rounded-full" />

            <div className='intro-details'>
                <strong className="block text-2xl">{ title }</strong>
                <small className="block text-sm">{ description }</small>
                
                <div className='intro-buttons flex gap-4'>
                    <button
                        className='play-button bg-pink-500 text-white px-6 py-3 rounded-full flex items-center gap-2'
                        onClick={ () => dispatch(playSong({ playlist, index: 0 })) }
                    >
                        <FaPlay className="text-xl" />
                        <span>Play</span>
                    </button>

                    <FavoriteButton type={ type } id={ id } />
                </div>
            </div>
        </div>
    );
};

export default IntroContainer;
