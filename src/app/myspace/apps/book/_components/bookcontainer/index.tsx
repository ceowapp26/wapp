import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import BookResult from '../bookresult';
import Utils from '@/utils/bookUtils';
import { initializeLists, selectCurrentBook } from '@/redux/features/apps/book/booksSlice';

const BookContainer = ({ subject }) => {
  const dispatch = useAppDispatch();
  const [booksHTML, setBooksHTML] = useState(null);
  const [utils, setUtils] = useState(null);
  const startIndex = useAppSelector(selectCurrentBook);
  const [totalIndex, setTotalIndex] = useState(6);

  useEffect(() => {
    dispatch(initializeLists({ startIndex, totalIndex, subject }));
  }, [dispatch, subject, startIndex, totalIndex]);

  const drawChartBook = async (subject, startIndex) => {
    try {
      const cdata = await utils.getBooks(`subject:${subject}&startIndex=${startIndex}&maxResults=6`);
      if (cdata.error) {
        setBooksHTML(<div className='flex items-center justify-center p-4 text-secondary transition-all'>ツ Limit exceeded! Try after some time</div>);
      } else if (cdata.totalItems === 0) {
        setBooksHTML(<div className='flex items-center justify-center p-4 text-secondary transition-all'>ツ No results, try a different term!</div>);
      } else if (cdata.totalItems === undefined) {
        setBooksHTML(<div className='flex items-center justify-center p-4 text-secondary transition-all'>ツ Network problem!</div>);
      } else if (!cdata.items || cdata.items.length === 0) {
        setBooksHTML(<div className='flex items-center justify-center p-4 text-secondary transition-all'>ツ There is no more result!</div>);
      } else {
        setTotalIndex(cdata.totalItems);
        const newBooksHTML = cdata.items.map(({ id, volumeInfo }) => (
          <BookResult key={id} bookId={id} bookLink={volumeInfo.previewLink} volumeInfo={volumeInfo} />
        ));
        setBooksHTML(newBooksHTML);
      }
    } catch (error) {
      console.error('Error in drawChartBook:', error);
    }
  };

  useEffect(() => {
    const utilsInstance = new Utils();
    setUtils(utilsInstance);
    return () => {
      setUtils(null);
    };
  }, []); 

  useEffect(() => {
    if (utils) {
      drawChartBook(subject, startIndex);
    }
  }, [utils, subject, startIndex]);

  return (
    <>
      {booksHTML || (
        <div className='flex items-center justify-center p-4 text-secondary transition-all'>
          <div className="w-8 h-8 mb-8 rounded-full bg-secondary animate-fadein"></div>
        </div>
      )}
    </>
  );
};

export default BookContainer;


