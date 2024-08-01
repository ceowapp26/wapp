"use client";
import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateFilter } from '@/utils/searchEvent';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { setSearchValue, selectSearchs } from '@/redux/features/apps/book/searchsSlice';
import { useMyspaceContext } from '@/context/myspace-context-provider';

const SearchButtonAuthor = ({ authors }) => {
  const searchTerm = useAppSelector(selectSearchs);
  const { viewPort, setViewPort } = useMyspaceContext();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const viewPortElement = document.getElementById("search");
    if (viewPortElement && !viewPort) {
      setViewPort(viewPortElement);
    }
  }, []);

  const handleInput = useCallback(
    (e) => {
      if (viewPort) {
        const newValue = updateFilter(e.target, viewPort, e.target.value, 'author');
        dispatch(setSearchValue(newValue));
      }
    },
    [dispatch]
  );

  return (
    <a
      className='overflow-hidden text-black text-ellipsis max-h-[30px] w-[200px] cursor-pointer hover:text-white transition-all'
      onClick={(e) => handleInput(e)}
    >
      {authors === undefined ? 'Others' : authors}
    </a>
  );
};

export default SearchButtonAuthor;
