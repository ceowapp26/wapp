import React from 'react';
import { motion } from 'framer-motion';
import Utils from '@/utils/bookUtils';
import SearchButtonInfor from '../searchbutton/SearchButtonInfor';
import SearchButtonAuthor from '../searchbutton/SearchButtonAuthor';
import ViewButtonTitle from '../viewbutton/ViewButtonTitle';
import ViewButtonThumbnail from '../viewbutton/ViewButtonThumbnail';
import EditButtonContainer from '../editlistbutton/EditButtonContainer';
import { useTheme } from 'next-themes';

const BookResult = ({ bookId, bookLink, volumeInfo }) => {
  const utils = new Utils();
  const { theme } = useTheme();

  return (
    <motion.div
      key={bookId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col md:flex-row m-4 p-6 rounded-lg shadow-lg max-w-[450px] ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
      style={{
        background: `linear-gradient(${utils.getRandomColor()}, ${
          theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        })`,
      }}
    >
      <ViewButtonThumbnail bookID={bookId} bookLink={bookLink} volumeInfo={volumeInfo} />
      <div className='flex flex-col items-start p-2 pl-4 gap-4 w-full md:w-[250px]'>
        <ViewButtonTitle bookID={bookId} bookLink={bookLink} title={volumeInfo.title} />
        <SearchButtonAuthor authors={volumeInfo.authors} />
        <SearchButtonInfor categories={volumeInfo.categories} />
        <EditButtonContainer bookID={bookId} />
      </div>
    </motion.div>
  );
};

export default BookResult;
