import React, { forwardRef } from 'react';

const NavigationMenu = forwardRef(({ activeSection, handleSectionClick, isSticky, isVisible }) => {
  return (
    <div className={`flex justify-center items-center ${isSticky ? 'fixed top-[calc(100vh-128px)]' : 'absolute top-[calc(100vh-32px)]'} z-50 p-8 w-full cursor-pointer ${isVisible ? 'visible' : 'hidden'}`}>
      <navigation-sticky-wrapper
        data-stop-section-id="#navigation-stop_1"
        data-navigation="#navigation"
        className="flex w-full"
      >
        <nav className="scroll-behavior-smooth">
          <navigation-manager className="w-full flex justify-center relative">
            <ul className="flex items-center justify-center gap-x-[2.5rem] w-full flex-no-wrap rounded-[12.5rem] h-full max-h-full list-none px-[1.625rem] bg-[#464344] overflow-scroll scroll-behavior-smooth scroll-snap-x-[mandatory] ms-overflow-style-none scrollbar-none">
              <li className="mt-0.5 focus:transition-none focus:opacity-100 scroll-snap-align-center transition-opacity-[.7s*var(--motion)] transition-background-color-0.2s ease-out">
                <a
                  href="#explore"
                  className={`inline-block rounded-full font-sans font-normal text-md leading-[160%] tracking-[.3px] whitespace-nowrap no-underline ${activeSection === 1 ? 'text-white p-2 bg-gray-800 transition-[background-color 200ms] ease-in' : 'opacity-[.1]'}`}
                  onClick={() => handleSectionClick(1)}
                >
                  <span className="p-4">Explore</span>
                </a>
              </li>
              <li className="mt-0.5 focus:transition-none focus:opacity-100 scroll-snap-align-center transition-opacity-[.7s*var(--motion)] transition-background-color-0.2s ease-out">
                <a
                  href="#display"
                  className={`inline-block rounded-full font-sans font-normal text-md leading-[160%] tracking-[.3px] whitespace-nowrap no-underline ${activeSection === 2 ? 'text-white p-2 bg-gray-800 transition-[background-color 200ms] ease-in' : 'opacity-[.1]'}`}
                  onClick={() => handleSectionClick(2)}
                >
                  <span className="p-4">Display</span>
                </a>
              </li>
              <li className="mt-0.5 focus:transition-none focus:opacity-100 scroll-snap-align-center transition-opacity-[.7s*var(--motion)] transition-background-color-0.2s ease-out">
                <a
                  href="#prompt"
                  className={`inline-block rounded-full font-sans font-normal text-md leading-[160%] tracking-[.3px] whitespace-nowrap no-underline ${activeSection === 3 ? 'text-white p-2 bg-gray-800 transition-[background-color 200ms] ease-in' : 'opacity-[.1]'}`}
                  onClick={() => handleSectionClick(3)}
                >
                  <span className="p-4">Prompt</span>
                </a>
              </li>
            </ul>
            <div id="indicator_wrapper" className="indicator_wrapper">
              <div id="mobile_indicator" className="mobile_indicator" style={{ transform: 'translate(26.8px, 0px) scale(0.1491, 1)' }}>
              </div>
            </div>
          </navigation-manager>
        </nav>
      </navigation-sticky-wrapper>
    </div>
  );
});

NavigationMenu.displayName = 'NavigationMenu'; 

export default NavigationMenu;


