"use client"
import React from 'react';
import HeadSection from './_components/head-section';
import BoxSection from './_components/box-section';
import VideoSection from './_components/video-section';
import CarouselSection from './_components/carousel-section';
import TableSection from './_components/table-section';
import Footer from '@/components/footer'

const AdditionalPage = () => {
  return (
    <React.Fragment>
      <HeadSection />
      <BoxSection />
      <VideoSection />
      <CarouselSection />
      <TableSection />
      <Footer />
    </React.Fragment>
  );
};

export default AdditionalPage;
