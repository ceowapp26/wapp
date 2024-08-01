import React from 'react';

const ButtonPrev = ({ categoryId, currentIndex, totalIndex, onClick }) => {
  return (
    <button
      id={`${categoryId}-prev`}
      className={`w-12 h-12 rounded-full bg-blue-800 text-white text-2xl cursor-pointer transition duration-200 items-center justify-center hover:bg-blue-900 hover:text-gray-300 ${currentIndex > 0 ? 'inline-flex' : 'hidden'}`}
      onClick={onClick}
    >
      ◀
    </button>
  );
};

export default ButtonPrev;
