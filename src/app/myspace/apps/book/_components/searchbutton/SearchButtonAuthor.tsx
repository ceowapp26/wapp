import React, { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateFilter } from '@/utils/searchEvent';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import Utils from '@/utils/bookUtils';
import { setSearchValue, selectSearchs } from '@/stores/features/apps/book/searchsSlice';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { useTheme } from 'next-themes';

const SearchButtonAuthor = ({ authors }) => {
  const utils = new Utils();
  const { viewPort, setViewPort } = useMyspaceContext();
  const searchTerm = useAppSelector(selectSearchs);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();


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
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`overflow-hidden text-ellipsis rounded-md py-1 px-3 max-h-[30px] w-full cursor-pointer ${
        theme === 'dark' ? 'text-white hover:text-gray-200' : 'text-gray-800 hover:text-white'
      } transition-all duration-200`}
      onClick={handleInput}
      style={{ backgroundColor: utils.getRandomColor(theme === 'dark' ? 0.7 : 0.3) }}
    >
      {authors || 'Others'}
    </motion.a>
  );
};

export default SearchButtonAuthor;
