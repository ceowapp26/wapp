import React, { useState } from 'react';

const ItemCarouselContainer = () => {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < items.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="flex items-center justify-center my-5">
      <button onClick={handlePrev} className="mx-2 px-4 py-2 text-base font-medium text-gray-700 bg-gray-200 rounded-md transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
        Prev
      </button>
      <div className="flex gap-4 overflow-hidden">
        {items.map((item, index) => (
          <div key={index} className={`p-4 border border-gray-300 rounded-md transition-transform ${index === currentIndex ? 'transform scale-125' : ''}`}>
            {item}
          </div>
        ))}
      </div>
      <button onClick={handleNext} className="mx-2 px-4 py-2 text-base font-medium text-gray-700 bg-gray-200 rounded-md transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
        Next
      </button>
    </div>
  );
};

export default ItemCarouselContainer;
