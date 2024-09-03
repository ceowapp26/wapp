"use client"

import React from "react";
import HeroSection from "./hero";
import TransitionCard from "./transition-card";
import IntroSection from "./intro";
import PriceSecion from "./price";
import FaqSection from "./faq";
import ContactSection from "./contact";

const Body = () => {
  return (
    <div className="h-full flex flex-col flex-1 dark:bg-white bg-black">
      <HeroSection />
      <TransitionCard /> 
      <IntroSection />
      <PriceSecion />
      <FaqSection />
      <ContactSection />
    </div>
  );
}

export default Body;
