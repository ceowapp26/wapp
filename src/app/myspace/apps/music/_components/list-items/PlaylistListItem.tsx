import { getYearFromDate } from '@/utils/formatters';
import Link from 'next/link';

const PlaylistListItem = ({ id, title, imgSrc, creationDate }) => {
    const createdYear = getYearFromDate(creationDate);
    return (
        <li className='min-w-[14rem]'>
            <Link href={ `/myspace/apps/music/home/playlist/${id}` }>
                <div className='flex items-center gap-4'>
                    <img className='h-20 w-20 rounded-full' src={ imgSrc } alt='playlist-img' />
                    <div className='max-w-[8rem] flex flex-col w-full'>
                        <strong className='block p-2 text-white'>{ title }</strong>
                        <small className='block p-2 text-white'>{ createdYear }</small>
                    </div>
                </div>
            </Link>
        </li>
    );
};

export default PlaylistListItem;
