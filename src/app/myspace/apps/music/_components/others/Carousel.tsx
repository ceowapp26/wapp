'use client';
import useCarousel from '@/hooks/use-carousel';

const Carousel = ({ children, header }) => {
    const { carouselRef, next, prev } = useCarousel();

    return (
        <>
            <div className='flex gap-8 text-light'>
                {header && <h2 className='text-2xl font-bold text-white mb-4'>{header}</h2>}

                <div className='flex gap-1'>
                    <button 
                        onClick={prev} 
                        className='h-auto px-1 transition-colors duration-200 cursor-pointer text-white text-light text-2xl hover:text-gray-400'
                    >
                        {'<'}
                    </button>
                    <button 
                        onClick={next} 
                        className='h-auto px-1 transition-colors duration-200 cursor-pointer text-white text-light text-2xl hover:text-gray-400'
                    >
                        {'>'}
                    </button>
                </div>
            </div>

            <div className='overflow-x-auto mask-linear-gradient'>
                <ul ref={carouselRef} className='relative flex transition-transform duration-200 ease-in-out'>
                    {children}
                </ul>
            </div>
        </>
    );
};

export default Carousel;
