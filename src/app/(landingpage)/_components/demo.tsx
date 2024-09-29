import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import { Tabs, Tab, Card, CardContent, CardActions, CardMedia, Typography, Grid, Box, Button, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { ChevronRight, ChevronLeft, MoveRight, MoveLeft } from 'lucide-react';

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

  return <span ref={textRef} className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-center font-bold"></span>;
};

const CustomButton = ({ direction = 'right', onClick }) => {
  const isRight = direction === 'right';

  return (
    <button
      onClick={onClick}
      className="group relative w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center overflow-hidden shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      <motion.div
        initial={{ rotate: isRight ? 10 : -10, x: 0 }}
        whileHover={{ rotate: 0, x: isRight ? 2 : -2 }}
        transition={{ duration: 0.3 }}
        className="text-white"
      >
        {isRight ? (
          <MoveRight className="w-6 h-6" />
        ) : (
          <MoveLeft className="w-6 h-6" />
        )}
      </motion.div>
      <span className="sr-only">{isRight ? 'Next' : 'Previous'}</span>
      <motion.div
        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
};

const StyledVideoCard = styled('div')({
  overflow: 'hidden',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.common.white,
  borderRadius: '16px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
});

const StyledIframe = styled('iframe')({
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  border: 'none',
  '@media (max-width: 768px)': {
    height: '250px',
  },
});

const EmbeddedVideo = ({ source, title }) => {
  return (
    <Suspense
      fallback={
        <StyledVideoCard>
          <CardContent>
            <VideoLoadingSpinner />
          </CardContent>
        </StyledVideoCard>
      }
    >
      <StyledVideoCard>
        <CardContent>
          <StyledIframe
            title={title}
            src={source}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </CardContent>
      </StyledVideoCard>
    </Suspense>
  );
};

const VideoCarousel = ({ videos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  useEffect(() => {
    gsap.to(carouselRef.current.children, {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.5,
    });

    gsap.to(carouselRef.current.children[activeIndex], {
      scale: 1,
      opacity: 1,
      duration: 0.5,
    });
  }, [activeIndex]);

  return (
    <div className="relative px-6">
      <div ref={carouselRef} className="flex justify-center items-center space-x-4 px-24">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ${
              index === activeIndex ? 'z-10' : 'z-0'
            }`}
          >
            <EmbeddedVideo source={video.src} title={video.title} />
          </div>
        ))}
      </div>
      <div className="absolute flex items-center left-0 top-1/2 h-full transform -translate-y-1/2 px-4 min-w-16">
        <CustomButton direction="left" onClick={handlePrev} />
      </div>
      <div className="absolute flex items-center right-0 top-1/2 h-full transform -translate-y-1/2 px-4 min-w-16">
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
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-[20%_75%] gap-8 items-center mb-12">
        <TextAnimation />
        <VideoCarousel videos={videos} />
      </div>
    </div>
  );
};

export default DemoSection;