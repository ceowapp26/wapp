"use client";
import { useRouter } from 'next/navigation'; 
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { setSearchValue, selectSearchs } from '@/redux/features/apps/book/searchsSlice';
import { forwardRef, useEffect } from 'react'; 

const SearchBar = forwardRef((props, ref) => { 
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchTerm = useAppSelector(selectSearchs);

    const handleInput = (event) => {
        const newValue = event.target.value;
        dispatch(setSearchValue(newValue)); 
    };

    return (
        <div className="flex justify-between items-center p-8 w-full">
            <input
              id="search"
              ref={ref}
              onChange={handleInput}
              className="flex-grow py-2 border-input text-slate-800 border ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:italic placeholder:text-slate-400 h-10 w-full py-2 pl-9 pr-3 bg-gray-100 focus:bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Search books by name, author, genre and etc ..."
              aria-label="Search books"
              value={searchTerm}
            />   
        </div>           
    );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;



