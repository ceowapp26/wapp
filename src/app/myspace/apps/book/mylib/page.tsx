"use client";
import React from 'react';
import MyLibrarySection from '../_components/mylibrarysection';
import MyLibBookSideBar from '../_components/mylibbooksidebar';

const MyLibraryPage = () => {
    return (
        <React.Fragment>
            <MyLibBookSideBar />
            <MyLibrarySection />
        </React.Fragment>
    );
};

export default MyLibraryPage;
