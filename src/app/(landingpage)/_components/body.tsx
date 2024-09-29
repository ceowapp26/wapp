"use client"

import React from "react";
import HeroSection from "./hero";
import ProductSection from "./product";
import DemoSection from "./demo";
import TransitionCard from "./transition-card";
import IntroSection from "./intro";
import PriceSecion from "./price";
import FaqSection from "./faq";
import ContactSection from "./contact";
import AnimatedSection from '@/components/animated-section';
import ScrollTransition from "./scroll-transition";
import InnovativeTransition from "./innovative-transition";

const Body = () => {
  return (
    <div className="h-full flex flex-col flex-1 dark:bg-white bg-black">
      <HeroSection />
      <AnimatedSection animation="slideFromLeft">
        <TransitionCard /> 
      </AnimatedSection>
      <AnimatedSection animation="slideFromRight">
        <ProductSection />
      </AnimatedSection>
      <ScrollTransition />
      <AnimatedSection animation="scale">
        <DemoSection />
      </AnimatedSection>
       <AnimatedSection animation="fadeIn">
        <IntroSection />
      </AnimatedSection>
      <AnimatedSection animation="slideFromLeft">
        <PriceSecion />
      </AnimatedSection>
      <AnimatedSection animation="slideFromRight">
        <FaqSection />
      </AnimatedSection>
      <AnimatedSection animation="scale">
        <InnovativeTransition />
      </AnimatedSection>
      <AnimatedSection animation="fadeIn">
        <ContactSection />
      </AnimatedSection>
    </div>
  );
}

export default Body;
