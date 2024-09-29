import React from 'react';

const ScrollBanner = ({ direction }) => {
  const items = ["AI-Powered", "Secure", "Scalable", "Customizable", "Efficient", "Collaborative"];
  
  return (
    <div className="relative w-full overflow-hidden py-4 bg-black">
      <div className={`flex ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}>
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex-shrink-0 mx-8 h-16 flex items-center relative">
            <div className="text-white font-bold bg-white/30 backdrop-blur-lg rounded-full px-4 py-2 z-10">
              {item}
            </div>
            <svg className="absolute left-full top-1/2 w-16 h-8 -translate-y-1/2" viewBox="0 0 100 50">
              <path 
                d="M0,25 Q25,0 50,25 T100,25" 
                fill="none" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="2"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 50 25"
                  to="360 50 25"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <circle cx="0" cy="25" r="3" fill="white">
                <animate
                  attributeName="cx"
                  from="0"
                  to="100"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="100" cy="25" r="3" fill="white">
                <animate
                  attributeName="cx"
                  from="100"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScrollTransition = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 rounded-md">
      <ScrollBanner direction="left" />
      <ScrollBanner direction="right" />
    </div>
  );
};

export default ScrollTransition;