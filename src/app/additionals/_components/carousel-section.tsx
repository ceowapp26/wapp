import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styled from 'styled-components';

const CarouselItem = styled.div`
  padding: 0 10px;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const CarouselSection = () => {
  const images = [
    "/global/additionals/ai-technology.webp",
    "/global/additionals/ai-technology.webp",
    "/global/additionals/ai-technology.webp"
  ];

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Carousel
      responsive={responsive}
      showDots
      autoPlay
      infinite
      autoPlaySpeed={3000}
      containerClass="carousel-container"
    >
      {images.map((src, index) => (
        <CarouselItem key={index}>
          <CarouselImage src={src} alt={`Carousel Image ${index + 1}`} />
        </CarouselItem>
      ))}
    </Carousel>
  );
};

export default CarouselSection;
