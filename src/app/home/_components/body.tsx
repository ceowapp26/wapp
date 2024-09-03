"use client";
import React, { useRef, useState, useEffect } from 'react';
import $ from 'jquery';
import ExploreSection from './explore';
import DisplaySection from './display';
import PromptSection from './prompt';
import NavigationMenu from './navigation';

const Body = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const exploreSectionRef = useRef(null);
  const displaySectionRef = useRef(null);
  const promptSectionRef = useRef(null);

  const refs = [
    exploreSectionRef,
    displaySectionRef,
    promptSectionRef
  ];

  const handleSectionClick = (section) => {
    setActiveSection(section);
    refs[section - 1].current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionOffsets = refs.map(ref => ref.current.offsetTop);
      const scrollPosition = document.body.scrollTop + window.innerHeight / 2;
      const scrollTop = document.body.scrollTop;
      const exploreSectionHeight = exploreSectionRef.current.clientHeight;
      const promptSectionBottom = promptSectionRef.current.offsetTop + promptSectionRef.current.clientHeight;

      for (let i = sectionOffsets.length - 1; i >= 0; i--) {
        if (scrollPosition >= sectionOffsets[i]) {
          setActiveSection(i + 1);
          break;
        }
      }

      if (scrollTop > exploreSectionHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      if (scrollTop + window.innerHeight >= promptSectionBottom) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    $(document.body).on('scroll', handleScroll);

    return () => {
      $(document.body).off('scroll', handleScroll);
    };
  }, [refs]);

  return (
    <React.Fragment>
      <NavigationMenu activeSection={activeSection} handleSectionClick={handleSectionClick} isSticky={isSticky} isVisible={isVisible} />
      <div ref={exploreSectionRef}><ExploreSection /></div>
      <div ref={displaySectionRef}><DisplaySection /></div>
      <div ref={promptSectionRef}><PromptSection /></div>
    </React.Fragment>
  );
};

export default Body;
