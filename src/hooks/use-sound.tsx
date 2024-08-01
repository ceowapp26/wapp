import React, { useEffect, useState } from "react";
import { useMyspaceContext } from "@/context/myspace-context-provider";

export const useSound = ({ filePath, options, onEnded }) => {
  const { audioRef, homePlayerToggle, setHomePlayerToggle } = useMyspaceContext();
  const audio = audioRef?.current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };
    if (audio) {
      audio.src = filePath;
      audio.load();
      audio.addEventListener("canplaythrough", handleCanPlayThrough);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      }
    };
  }, [audio, filePath]);

  const audioAction = {
    play: () => {
      if (audio && isLoaded && audio.paused) {
        audio.play().then(() => {
          if (!homePlayerToggle) {
            setHomePlayerToggle(true);
          }
        });
        setIsPlaying(true);
      }
    },
    stop: () => {
      if (audio && isLoaded && !audio.paused) {
        audio.currentTime = 0;
        audio.pause();
        if (homePlayerToggle) {
          setHomePlayerToggle(false);
        }
        setIsPlaying(false);
      }
    },
    toggle: () => {
      if (audio && isLoaded) {
        if (!isPlaying) {
          audio.play();
          setHomePlayerToggle(true);
        } else {
          audio.pause();
          setHomePlayerToggle(false);
        }
        setIsPlaying(prevIsPlaying => !prevIsPlaying);
      }
    },
    setVolume: (value) => {
      if (audio) {
        audio.volume = value;
      }
    },
  };

  return audioAction;
};
