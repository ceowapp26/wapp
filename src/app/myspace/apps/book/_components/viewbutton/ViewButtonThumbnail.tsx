"use client";
import { useCallback } from 'react';
import { showBookPreview } from '@/redux/features/apps/book/viewsSlice'; 
import { useAppDispatch } from '@/hooks/hooks';
import Utils from '@/utils/bookUtils';
import { useRouter } from 'next/navigation'; 

const ViewButtonThumbnail = ({ bookID, bookLink, volumeInfo }) => {
    const utils = new Utils();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleInput = useCallback(() => {
        dispatch(showBookPreview(bookLink));
        router.push(bookLink);
    }, [dispatch, router, bookLink]);

    return (
        <a className="text-inherit text-decoration-none" onClick={handleInput}>
            <img className="mr-8 mt-8 rounded-lg shadow-md min-w-[128px] min-h-[201px] transition duration-200 transform -translate-y-[64px] hover:scale-105" src={utils.extractThumbnail(volumeInfo)} width="128" height="201" alt='cover' />
        </a>
    );
};

export default ViewButtonThumbnail;
