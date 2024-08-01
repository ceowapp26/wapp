"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
      className="relative h-screen w-full flex bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white max-w-12xl mx-auto p-10"
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
          className="row-span-1 flex flex-col justify-center items-center w-4/5 mx-auto"
        >
          <div className="flex h-1/2 w-full">
            <div className="flex justify-center items-center w-3/5 h-full bg-gray-800 rounded-tl-[80px]">
              <h2 className="text-white mobileXL:text-xl text-2xl uppercase m-2">To Shape the</h2>
            </div>
            <div className="flex justify-center items-center w-2/5 bg-white border-1 border-solid border-indigo-500 rounded-tr-[80px]">
              <b className="relative h-[50px] float-left top-0 overflow-hidden">
                <div className="relative inline-block whitespace-nowrap text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-purple-600 bg-clip-text animate-gradient bg-[200%_200%] mobileL:text-xl mobileXL:text-3xl text-5xl animate-moveTxt">
                  World<br />
                  Future<br />
                  Life
                </div>
              </b>
            </div>
          </div>
          <hr className="w-full" />
          <div className="flex h-1/2 w-full">
            <div className="flex justify-center items-center w-3/5 h-full bg-white border-1 border-solid border-indigo-500 rounded-bl-[80px]">
              <h2 className="text-gray-800 mobileXL:text-xl text-2xl uppercase m-2">To Change the</h2>
            </div>
            <div className="flex justify-center items-center w-2/5 bg-gray-800 rounded-br-[80px]">
              <b className="relative h-[50px] float-left top-0 overflow-hidden">
                <div className="relative inline-block whitespace-nowrap text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-purple-600 bg-clip-text animate-gradient bg-[200%_200%] mobileL:text-xl mobileXL:text-3xl text-5xl animate-moveTxt">
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
          className="row-span-1 flex flex-col items-center justify-center p-6"
        >
          <h1 className="dark:text-white text-black text-8xl uppercase m-2 font-extrabold relative">
            <span className="relative z-10 top-12">JOIN US</span>
            <div className="relative mobileXL:w-6 mobileXL:h-6 w-10 h-10 rounded-full bg-gradient-radial from-white via-aqua to-darkblue -top-20 left-4 animate-pulse"></div>
          </h1>
        </motion.div>
        <div className="row-span-1 flex justify-center items-center">
          <span className="absolute bg-white text-black border border-blue-700 rounded-lg w-[200px] h-[100px] flex items-center justify-center font-bold uppercase text-sm">
            <p className="m-0">Explore</p>
          </span>
          <button className="absolute cursor-pointer text-white bg-black border-1 border-blue-700 rounded-lg w-[200px] h-[100px] p-0 font-inherit text-sm flex overflow-hidden items-center justify-center uppercase border-none hover:animate-aniMask mask-nature-sprite">
            <div className="absolute bg-blue-700 w-[150%] h-[200%] top-[-50%] left-[-25%] transform translate-y-[75%]"></div>
            <span className="flex items-center justify-center w-full h-full">
              <span>Explore</span>
            </span>

          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;


