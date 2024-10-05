"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ContactSection = () => {
  const parentDivRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    const parentDiv = parentDivRef.current;
    const blob = blobRef.current;

    const onMouseMove = (e) => {
      if (parentDiv && blob) {
        const rect = parentDiv.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const blobX = Math.min(Math.max(x, 0), rect.width);
        const blobY = Math.min(Math.max(y, 0), rect.height);

        blob.style.transform = `translate3d(calc(${blobX}px - 50%), calc(${blobY}px - 50%), 0)`;
      }
    };

    const handleMouseEnter = () => {
      if (blob) {
        blob.style.visibility = "visible";
        parentDiv.addEventListener("mousemove", onMouseMove);
      }
    };

    const handleMouseLeave = () => {
      if (blob) {
        blob.style.visibility = "hidden";
        parentDiv.removeEventListener("mousemove", onMouseMove);
      }
    };

    if (parentDiv) {
      parentDiv.addEventListener('mouseenter', handleMouseEnter);
      parentDiv.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (parentDiv) {
        parentDiv.removeEventListener('mouseenter', handleMouseEnter);
        parentDiv.removeEventListener('mouseleave', handleMouseLeave);
      }
      parentDiv.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-screen w-full flex bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white max-w-12xl mx-auto py-10 px-2 sm:p-10"
    >
      <div 
        className="relative grid grid-rows-[1.2fr_1fr_1fr] mobileL:bg-dark mobileL:dark:bg-white bg-white dark:bg-black w-full h-full pt-10 rounded-3xl" 
        ref={parentDivRef} 
        >
        <div
          className="absolute blur-[100px] pointer-events-none flex justify-center items-center w-40 h-40 rounded-full"
          style={{
            backgroundImage: 'linear-gradient(#1100ff 10%, #ff00f2)',
            transform: 'translate(calc(-50% + 15px), -50%)',
          }}
          ref={blobRef}
        ></div>
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="row-span-1 flex flex-col justify-center items-center w-full px-2 sm:w-4/5 sm:p-0 mx-auto"
        >
          <div className="flex h-1/2 w-full">
            <div className="flex justify-center items-center w-1/2 sm:w-3/5 h-full bg-gray-800 rounded-tl-[80px]">
              <h2 className="text-white text-md sm:text-lg md:text-xl lg:text-3xl xl:text-4xl uppercase text-center px-4 sm:px-2">To Shape the</h2>
            </div>
            <div className="flex justify-center items-center w-1/2 sm:w-2/5 bg-white border-1 border-solid border-indigo-500 rounded-tr-[80px]">
              <b className="relative h-[50px] float-left top-0 overflow-hidden">
              <div className="relative inline-block whitespace-nowrap text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-purple-600 bg-clip-text animate-gradient bg-[200%_200%] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-1 animate-moveTxt">
                World<br />
                Future<br />
                Life
              </div>
              </b>
            </div>
          </div>
          <hr className="w-full" />
          <div className="flex h-1/2 w-full">
            <div className="flex justify-center items-center w-1/2 sm:w-3/5 h-full bg-white border-1 border-solid border-indigo-500 rounded-bl-[80px]">
              <h2 className="text-gray-800 text-md sm:text-lg md:text-xl lg:text-3xl xl:text-4xl uppercase text-center pl-2 sm:px-2">To Change the</h2>
            </div>
            <div className="flex justify-center items-center w-1/2 sm:w-2/5 bg-gray-800 rounded-br-[80px]">
              <b className="relative h-[50px] float-left top-0 overflow-hidden">
              <div className="relative inline-block whitespace-nowrap text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-purple-600 bg-clip-text animate-gradient bg-[200%_200%] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-1 animate-moveTxt">
                  Future<br />
                  Life<br />
                  World
                </div>
              </b>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="row-span-1 flex flex-col items-center justify-center p-4 sm:p-6"
        >
          <h1 className="dark:text-white text-black mobileL:dark:text-black text-4xl sm:text-6xl md:text-8xl uppercase m-2 font-extrabold relative">
            <span className="relative z-10 top-7 sm:top-12">JOIN US</span>
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-radial from-white via-aqua to-darkblue -top-8 sm:-top-10 md:-top-20 left-1 sm:left-2 md:left-4 animate-pulse"></div>
          </h1>
        </motion.div>
        <div className="row-span-1 flex justify-center items-center">
          <span className="absolute bg-white text-black border border-blue-700 rounded-lg w-[150px] sm:w-[200px] h-[80px] sm:h-[100px] flex items-center justify-center font-bold uppercase text-xs sm:text-sm">
            <p className="m-0">Explore</p>
          </span>
          <Link href="/auth/sign-in" className="absolute cursor-pointer text-white bg-black border border-blue-700 rounded-lg w-[150px] sm:w-[200px] h-[80px] sm:h-[100px] p-0 font-inherit text-xs sm:text-sm flex overflow-hidden items-center justify-center uppercase hover:animate-aniMask mask-nature-sprite">
            <div className="absolute bg-blue-700 w-[150%] h-[200%] top-[-50%] left-[-25%] transform translate-y-[75%]"></div>
            <span className="flex items-center justify-center w-full h-full">
              <span>Explore</span>
            </span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;

