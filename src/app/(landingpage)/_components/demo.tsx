import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Play } from 'lucide-react';

const VideoLoadingSpinner = lazy(() => import('@/components/video-loading-spinner'));

gsap.registerPlugin(TextPlugin);

const TextAnimation = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const texts = ['Watch Our Demo', 'WApp Platform', 'WApp Portal', 'WApp Marketing', 'WApp Ecommerce',  'WApp Book',  'WApp Music'];
    const tl = gsap.timeline({ repeat: -1 });

    texts.forEach((text) => {
      tl.to(textRef.current, {
        duration: 1,
        text: { value: text, delimiter: "" },
        ease: "none",
      })
      .to(textRef.current, {
        duration: 2,
        opacity: 1,
      })
      .to(textRef.current, {
        duration: 1,
        opacity: 0,
      });
    });

    return () => {
      tl.kill();
    };
  }, []);

  return <span ref={textRef} className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-center font-bold mb-8"></span>;
};

const CustomButton = ({ direction = 'right', onClick }) => {
  const Icon = direction === 'right' ? ChevronRight : ChevronLeft;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center overflow-hidden shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 z-10"
    >
      <Icon className="w-6 h-6 text-white" />
      <span className="sr-only">{direction === 'right' ? 'Next' : 'Previous'}</span>
    </motion.button>
  );
};

const EmbeddedVideo = ({ source, title, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Suspense fallback={<VideoLoadingSpinner />}>
      <div className="relative w-full max-w-[800px] aspect-video rounded-lg overflow-hidden shadow-xl">
        {!isPlaying && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center"
            >
              <Play className="w-8 h-8 text-blue-600" />
            </motion.button>
          </div>
        )}
        {(isPlaying || isActive) && (
          <iframe
            title={title}
            src={`${source}${isActive ? '&autoplay=1' : ''}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </Suspense>
  );
};

const VideoCarousel = ({ videos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const carouselRef = useRef(null);
  const videoRef = useRef(null);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    gsap.to(carousel.children, {
      opacity: 0.3,
      scale: 0.8,
      duration: 0.5,
    });

    gsap.to(carousel.children[activeIndex], {
      opacity: 1,
      scale: 1,
      duration: 0.5,
    });
  }, [activeIndex]);

  useEffect(() => {
    const updateVideoHeight = () => {
      if (videoRef.current) {
        setVideoHeight(videoRef.current.clientHeight);
      }
    };
    updateVideoHeight();
    window.addEventListener('resize', updateVideoHeight);
    return () => {
      window.removeEventListener('resize', updateVideoHeight);
    };
  }, []);

  const buttonStyle = {
    top: `${videoHeight / 2}px`,
    transform: 'translateY(-50%)',
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 overflow-hidden" style={{ height: `${videoHeight}px`}}>
      <div ref={carouselRef} className="flex justify-center items-center">
        <AnimatePresence initial={false}>
          {videos.map((video, index) => (
            <motion.div
              ref={videoRef}
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: index === activeIndex ? 1 : 0.3, 
                scale: index === activeIndex ? 1 : 0.8,
                x: `${(index - activeIndex) * 100}%`
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 w-full flex justify-center items-center"
            >
              <EmbeddedVideo source={video.src} title={video.title} isActive={index === activeIndex} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="absolute left-2 sm:left-4" style={buttonStyle}>
        <CustomButton direction="left" onClick={handlePrev} />
      </div>
      <div className="absolute right-2 sm:right-4" style={buttonStyle}>
        <CustomButton direction="right" onClick={handleNext} />
      </div>
    </div>
  );
};

const DemoSection = () => {
  const videos = [
    { src: "https://www.youtube.com/embed/5ffEkUho9tE?si=wWKndqr9UD8wzcs-", title: "Text Editor" },
    { src: "https://www.youtube.com/embed/5ffEkUho9tE?si=wWKndqr9UD8wzcs-", title: "Code Editor" },
    { src: "https://www.youtube.com/embed/5ffEkUho9tE?si=wWKndqr9UD8wzcs-", title: "Video Editor" },
    { src: "https://www.youtube.com/embed/5ffEkUho9tE?si=wWKndqr9UD8wzcs-", title: "Watch Our Demo" },
  ];

  return (
    <section className="bg-gradient-to-b dark:from-gray-50 dark:to-white from-gray-900 to-gray-800 py-16 h-screen">
      <div className="container flex flex-col items-center justify-center mx-auto px-4 md:px-6 lg:px-8 h-full">
        <TextAnimation />
        <VideoCarousel videos={videos} />
      </div>
    </section>
  );
};

export default DemoSection;


