import React, { useEffect, useState, useRef } from "react";
import PauseIcon from "@mui/icons-material/Pause";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOne from "@mui/icons-material/RepeatOne";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  playSong,
  playLoopSong,
  playLoopOnceSong,
  playNextSong,
  playPreviousSong,
  selectCurrentIndex,
  selectCurrentSong,
  selectCurrentTracklist
} from "@/redux/features/apps/music/songsSlice";
import { selectPlayModeStatus } from "@/redux/features/apps/music/playmodeSlice";
import { useMyspaceContext } from '@/context/myspace-context-provider';

const PlayerControls = ({audio}) => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectPlayModeStatus);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const [playMode, updateMode] = useState("list");
  const [repeatMode, setRepeatMode] = useState("loop");
  const mounted = useRef(false);
  const { homePlayerToggle, setHomePlayerToggle, screenSize } = useMyspaceContext();
 
  const isAboveSmallScreen = screenSize >= 640;

  const toggleRepeatMode = () => {
    if (repeatMode === "loop") {
      setRepeatMode("looponce");
      updateMode("looponce");
    } else {
      setRepeatMode("loop");
      updateMode("loop");
    }
  };

  const playerHandler = () => {
    if (audio.paused) {
        audio.play();
        setHomePlayerToggle(true);
      } else {
        audio.pause();
        setHomePlayerToggle(false);
      }
  };

  return (
    <div className="flex justify-around py-6 items-center flex-row">
      {!isAboveSmallScreen && (
        <>
          <div
            className="text-white cursor-pointer"
            onClick={toggleRepeatMode}
          >
            {repeatMode === "loop" ? <RepeatIcon /> : <RepeatOne />}
          </div>
          <div
            className="text-white cursor-pointer"
            onClick={() => dispatch(playPreviousSong())}
          >
            <SkipPreviousIcon />
          </div>
        </>
      )}
      {!isAboveSmallScreen && (
        <FavoriteBorderIcon
          sx={{
            marginRight: "1rem",
            color: "rgb(87,114,255)",
            fontSize: "32px",
          }}
        />
      )}
      <div
        className="aspect-square w-8 sm:w-14 rounded-2xl flex items-center justify-center bg-white cursor-pointer"
      >
        <span onClick={playerHandler} className="text-player">
          {homePlayerToggle ? <PauseIcon /> : <PlayArrowIcon />}
        </span>
      </div>
      {!isAboveSmallScreen && (
        <>
          <div
            className="text-white cursor-pointer"
            onClick={() => dispatch(playNextSong())}
          >
            <SkipNextIcon />
          </div>
          <div
            className="text-white cursor-pointer"
            onClick={() => updateMode("random")}
          >
            <ShuffleIcon />
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerControls;


