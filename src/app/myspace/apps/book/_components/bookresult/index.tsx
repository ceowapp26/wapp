import React from 'react';
import Utils from '@/utils/bookUtils';
import SearchButtonInfor from '../searchbutton/SearchButtonInfor';
import SearchButtonAuthor from '../searchbutton/SearchButtonAuthor';
import ViewButtonTitle from '../viewbutton/ViewButtonTitle';
import ViewButtonThumbnail from '../viewbutton/ViewButtonThumbnail';
import EditButtonContainer from '../editlistbutton/EditButtonContainer';

const BookResult = ({ bookId, bookLink, volumeInfo }) => {
  const utils = new Utils();
  return (
    <div key={bookId} className='flex-1 m-4 p-8 rounded-lg max-w-[450px]' style={{ background: `linear-gradient(${utils.getRandomColor()}, rgba(0, 0, 0, 0))`, whiteSpace: "nowrap", display: 'flex', alignItems: 'flex-start' }}>
      <ViewButtonThumbnail bookID={bookId} bookLink={bookLink} volumeInfo={volumeInfo} />
        <div className='inline-flex flex-col items-start p-2 pl-4 gap-2 w-[250px]'>
          <ViewButtonTitle bookID={bookId} bookLink={bookLink} title={volumeInfo.title} />
          <SearchButtonAuthor authors={volumeInfo.authors} />
          <SearchButtonInfor categories={volumeInfo.categories} />
          <EditButtonContainer bookID={bookId} />
        </div>
    </div>
  );
};

export default BookResult;


