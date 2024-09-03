"use client"
import React from "react";
import Footer from "@/components/footer";
import Header from "./_components/header";
import Body from "./_components/body";
import dynamic from 'next/dynamic';

const LandingPage = () => {
  return (
    <React.Fragment>
      <Header />
      <Body />
      <Footer />
    </React.Fragment>
  );
};

export default LandingPage;
