import React, { SyntheticEvent } from 'react';
import clsx from 'clsx';

export const MenuWrapper: React.FC<{
  index: number,
  title: string,
  hovering: number | null,
  children: React.ReactNode,
  onMouseEnter: (index: number, event: SyntheticEvent) => void,
}> = (props) => {
  return (
    <div data-hover="true" data-delay="0" className="relative inline-block">
      <div className="grid gap-x-2 gap-y-2 text-white cursor-pointer items-center py-5 font-semibold flex">
        <a
          onMouseEnter={(event: SyntheticEvent) => {
            props.onMouseEnter(props.index, event);
          }}
        >
          {props.title}
        </a>
        <div className="flex items-center">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.78033 1.53033C10.0732 1.23744 10.0732 0.762558 9.78033 0.469667C9.48744 0.176777 9.01256 0.176777 8.71967 0.469667L9.78033 1.53033ZM5 5.25L4.46967 5.7803C4.76256 6.0732 5.23744 6.0732 5.53033 5.7803L5 5.25ZM1.2803 0.469667C0.987403 0.176777 0.512603 0.176777 0.219703 0.469667C-0.0731974 0.762557 -0.0731974 1.23744 0.219703 1.53033L1.2803 0.469667ZM8.71967 0.469667L4.46967 4.7197L5.53033 5.7803L9.78033 1.53033L8.71967 0.469667ZM5.53033 4.7197L1.2803 0.469667L0.219703 1.53033L4.46967 5.7803L5.53033 4.7197Z" fill="currentColor"></path>
          </svg>
        </div>
        <div className="dropdown-pointer hidden absolute bottom-31 left-1/2 transform -translate-x-1/2 rotate-45 border-t border-l border-gray-300 bg-gray-200 rounded-full w-20 h-20 z-10"></div>
      </div>
      {props.children}
    </div>
  );
}
