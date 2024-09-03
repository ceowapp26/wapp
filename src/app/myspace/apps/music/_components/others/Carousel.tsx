'use client';
import React from 'react';
import useCarousel from '@/hooks/use-carousel';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ children, header }) => {
    const { carouselRef, next, prev, currentIndex, itemsCount } = useCarousel();

    return (
        <div className="space-y-4">
            <div className='flex items-center justify-between'>
                {header && (
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-3xl font-bold text-white'
                    >
                        {header}
                    </motion.h2>
                )}
                <div className='flex items-center space-x-2'>
                    <CarouselButton onClick={prev} direction="left" />
                    <CarouselButton onClick={next} direction="right" />
                </div>
            </div>
            <div className='relative overflow-hidden'>
                <motion.div 
                    ref={carouselRef}
                    className='flex transition-transform duration-500 ease-out'
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                            next();
                        } else if (swipe > swipeConfidenceThreshold) {
                            prev();
                        }
                    }}
                >
                    <AnimatePresence initial={false}>
                        {React.Children.map(children, (child, index) => (
                            <motion.div
                                key={index}
                                className="flex-shrink-0 w-full px-2"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5 }}
                            >
                                {child}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
            <CarouselDots count={itemsCount} currentIndex={currentIndex} />
        </div>
    );
};

const CarouselButton = ({ onClick, direction }) => (
    <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className='p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200'
    >
        {direction === 'left' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
    </motion.button>
);

const CarouselDots = ({ count, currentIndex }) => (
    <div className="flex justify-center space-x-2 mt-4">
        {[...Array(count)].map((_, index) => (
            <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: index === currentIndex ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
            />
        ))}
    </div>
);

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export default Carousel;