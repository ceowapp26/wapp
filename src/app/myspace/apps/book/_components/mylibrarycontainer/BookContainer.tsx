"use client";
import React, { useEffect, useState } from 'react';
import BookResult from '../bookresult';

const BookContainer = ({ bookID, volumeInfo }) => {
  const [booksHTML, setBooksHTML] = useState(null);

  const drawChartBook = async () => {
    try {
      if (!volumeInfo) {
        setBooksHTML(<div className='prompt'>ツ No volume info available</div>);
      } else {
        const newBooksHTML = <BookResult id={bookID} bookId={bookID} bookLink={volumeInfo.previewLink} volumeInfo={volumeInfo} />;
        setBooksHTML(newBooksHTML);
      }
    } catch (error) {
      console.error('Error in drawChartBook:', error);
    }
  };


  useEffect(() => {
    drawChartBook();
  }, []);

  return (
    <>
      {booksHTML}
    </>
  );
};

export default BookContainer;
