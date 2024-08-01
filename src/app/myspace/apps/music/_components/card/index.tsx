import React, { useEffect, useRef, useState } from "react";
import { useSound } from "@/hooks/use-sound";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Image from 'next/image';
import { useMyspaceContext } from '@/context/myspace-context-provider';

const Card = ({ title, bg, active, url, askForPlaying }) => {
  const audio = useSound({
    filePath: url,
  });

  const [showButton, setShowButton] = useState(true); 

  const toggleButton = () => {
    setShowButton(prevShowButton => !prevShowButton);
  }

  function onMusicend() {
    if (playMode === "loop") {
      audio.play();
    } else {
      return;
    }
  }
  const handleToggle = () => {
    audio.toggle();
    toggleButton();
  };
  
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle()
      }}
      className={`${
        active ? "ring-cyan-500" : "ring-transparent"
      } relative cursor-pointer flex-shrink-0 bg-white w-[220px] h-[200px] rounded-10 overflow-hidden items-center justify-center transition-all duration-300`}
    >
      <Image src={bg} width={1280} height={720} alt={title} />
      {showButton && (
        <button style={{ top: "33.33%" }} className="absolute flex items-center justify-center text-5xl left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white bg-opacity-30 rounded-full">
          <PlayArrowIcon />
        </button>
      )}
      <div className="absolute bg-opacity-30 bg-black w-full bottom-0 py-8">
        <h1 className="font-bold text-16 capitalize text-center">{title}</h1>
      </div>
    </div>
  );
};

export default Card;



