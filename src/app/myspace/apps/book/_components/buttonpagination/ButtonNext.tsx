import React from 'react';

const ButtonNext = ({ categoryId, currentIndex, totalIndex, onClick }) => {
  return (
    <button
      id={`${categoryId}-next`}
      className={`w-12 h-12 rounded-full bg-blue-800 text-white text-2xl cursor-pointer transition duration-200 items-center justify-center hover:bg-blue-900 hover:text-gray-300 ${currentIndex > totalIndex ? 'hidden' : 'inline-flex'}`}
      onClick={onClick}
    >
      ▶
    </button>
  );
};

export default ButtonNext;
