'use client';
import { playSong } from '@/redux/features/apps/music/deezerSongsSlice';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/hooks';

const SearchResultItem = ({ type, result }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { id, name, title, picture_medium, md5_image } = result;     
    return (
        <li className="flex items-center gap-4 cursor-pointer"
            onClick={
                type === 'track'
                    ? () => dispatch(playSong({ playlist: [result], index: 0}))
                    : () => router.push(`/myspace/apps/music/home/${ type }/${ id }`)
            }
        >
            <img
                className="w-12 h-12 rounded-full"
                src={ picture_medium || `https://e-cdns-images.dzcdn.net/images/artist/${ md5_image }/1000x1000-000000-80-0-0.jpg` }
                alt={ title || name }
            />
            <span className='overflow-hidden'>{ name || title }</span>
        </li>
    );
};

export default SearchResultItem;
