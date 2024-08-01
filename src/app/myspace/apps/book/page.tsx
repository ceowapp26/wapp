"use client";
import React, { useRef } from 'react';
import SectionContainer from './_components/sectioncontainer';
import BookSidebar from './_components/booksidebar';
import { RefObject } from 'react';

const BookHomepage = () => {
  return (
      <React.Fragment>
        <BookSidebar />
        <SectionContainer />
      </React.Fragment>
  );
};

export default BookHomepage;
