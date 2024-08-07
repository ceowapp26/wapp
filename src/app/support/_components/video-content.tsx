import React, { useState, useRef } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

const VideoContent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const carouselItems = [
    { id: 1, image: '/global/platform/wapp-hero.png', alt: 'Platform Image 1' },
    { id: 2, image: '/global/platform/wapp-hero.png', alt: 'Platform Image 2' },
    { id: 3, image: '/global/platform/wapp-hero.png', alt: 'Platform Image 3' },
  ];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center">Featured Video</h1>
      <div className="relative aspect-w-16 aspect-h-9 mb-8 bg-black rounded-lg overflow-hidden shadow-xl">
        <video
          ref={videoRef}
          src="/global/videos/placeholder.mp4"
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={togglePlay}
              className="text-white hover:text-blue-500 transition-colors duration-200"
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full mx-4 accent-blue-500"
            />
            <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <button 
              onClick={toggleMute}
              className="text-white hover:text-blue-500 transition-colors duration-200 ml-4"
            >
              {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
            </button>
            <button 
              onClick={() => videoRef.current.requestFullscreen()}
              className="text-white hover:text-blue-500 transition-colors duration-200 ml-4"
            >
              <FaExpand size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Video Title</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Description of the video goes here. This can include details about the content, creator, or any other relevant information.
        </p>
        <a 
          href="https://youtu.be/KOwu8sML2dQ?si=0XMGlcQVFurZWijo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          <FaYoutube className="mr-2" /> Watch on YouTube
        </a>
      </div>
      <h2 className="text-3xl font-semibold mb-6 text-center">Platform Showcase</h2>
      <Carousel 
        responsive={responsive} 
        infinite={true} 
        autoPlay={true} 
        autoPlaySpeed={3000}
        className="pb-12"
      >
        {carouselItems.map(item => (
          <div key={item.id} className="px-2">
            <img 
              src={item.image} 
              alt={item.alt} 
              className="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </Carousel>
    </motion.div>
  );
};

export default VideoContent;