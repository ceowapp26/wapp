"use client";
import { useRef, useState, useEffect, useCallback } from 'react';
import { updateFilter } from '@/utils/searchEvent';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import Utils from '@/utils/bookUtils';
import { setSearchValue, selectSearchs } from '@/redux/features/apps/book/searchsSlice';
import { useMyspaceContext } from '@/context/myspace-context-provider';

const SearchButtonInfor = ({ categories }) => {
  const utils = new Utils();
  const { viewPort, setViewPort } = useMyspaceContext();
  const searchTerm = useAppSelector(selectSearchs);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!viewPort) {
      const viewPortElement = document.getElementById("search");
      if (viewPortElement) {
        setViewPort(viewPortElement);
      }
    }
  }, [viewPort, setViewPort]);
  
  const handleInput = useCallback(
    (e) => {
            if (viewPort) {
              const newValue = updateFilter(e.target, viewPort, e.target.value, 'subject');
              dispatch(setSearchValue(newValue));
            }
    },
    [dispatch]
  );

  return (
    <a className='overflow-hidden text-ellipsis rounded-md max-h-[30px] w-[200px] text-black cursor-pointer px-2 hover:text-white transition-all' 
       onClick={(e) => handleInput(e)}
       style={{ backgroundColor: utils.getRandomColor() }}
    >
      {categories === undefined ? 'Others' : categories}
    </a>
  );
};

export default SearchButtonInfor;
