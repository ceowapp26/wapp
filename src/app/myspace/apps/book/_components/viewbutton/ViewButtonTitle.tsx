"use client";
import { useCallback } from 'react';
import { showBookPreview } from '@/redux/features/apps/book/viewsSlice'; 
import { useAppDispatch } from '@/hooks/hooks'; 
import { useRouter } from 'next/navigation'; 

const ViewButtonTitle = ({ bookID, bookLink, title }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleInput = useCallback(
        () => {
            dispatch(showBookPreview(bookLink));
            router.push(bookLink);
        },
        [dispatch, bookLink]
    );

    return (
        <a className="overflow-hidden text-ellipsis text-wrap text-left line-clamp-3 max-h-[100px] w-[200px] my-0 text-2xl font-bold text-primary cursor-pointer hover:text-white transition-all" onClick={handleInput}>
            {title}
        </a>
    );
};

export default ViewButtonTitle;


