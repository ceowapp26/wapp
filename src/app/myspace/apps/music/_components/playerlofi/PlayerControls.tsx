"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { IconButton, Tooltip } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOne from "@mui/icons-material/RepeatOne";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
} from "@/stores/features/apps/music/songsSlice";
import { selectPlayModeStatus } from "@/stores/features/apps/music/playmodeSlice";
import { useMyspaceContext } from '@/context/myspace-context-provider';

const PlayerControls = ({ audio, onPlay, onPause }) => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectPlayModeStatus);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const [playMode, updateMode] = useState("list");
  const [repeatMode, setRepeatMode] = useState("loop");
  const [isFavorite, setIsFavorite] = useState(false);
  const { homePlayerToggle, setHomePlayerToggle, screenSize } = useMyspaceContext();

  const isAboveSmallScreen = screenSize >= 640;

  const toggleRepeatMode = () => {
    setRepeatMode(repeatMode === "loop" ? "looponce" : "loop");
    updateMode(repeatMode === "loop" ? "looponce" : "loop");
  };

  const playerHandler = () => {
    if (homePlayerToggle) {
        onPause();
        setHomePlayerToggle(false);
      } else {
        onPlay();
        setHomePlayerToggle(true);
      }
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="flex justify-around py-6 items-center flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!isAboveSmallScreen && (
        <>
          <Tooltip title={repeatMode === "loop" ? "Repeat All" : "Repeat One"}>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <IconButton onClick={toggleRepeatMode} color="primary">
                {repeatMode === "loop" ? <RepeatIcon /> : <RepeatOne />}
              </IconButton>
            </motion.div>
          </Tooltip>
          <Tooltip title="Previous">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <IconButton onClick={() => dispatch(playPreviousSong())} color="primary">
                <SkipPreviousIcon />
              </IconButton>
            </motion.div>
          </Tooltip>
        </>
      )}
      <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <IconButton onClick={() => setIsFavorite(!isFavorite)} color="primary">
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </motion.div>
      </Tooltip>
      <Tooltip title={homePlayerToggle ? "Pause" : "Play"}>
        <motion.div
          className="aspect-square w-16 h-16 rounded-full flex items-center justify-center bg-blue-500 cursor-pointer"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <IconButton onClick={playerHandler} color="secondary">
            {homePlayerToggle ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </motion.div>
      </Tooltip>
      {!isAboveSmallScreen && (
        <>
          <Tooltip title="Next">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <IconButton onClick={() => dispatch(playNextSong())} color="primary">
                <SkipNextIcon />
              </IconButton>
            </motion.div>
          </Tooltip>
          <Tooltip title="Shuffle">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <IconButton onClick={() => updateMode("random")} color="primary">
                <ShuffleIcon />
              </IconButton>
            </motion.div>
          </Tooltip>
        </>
      )}
    </motion.div>
  );
};

export default PlayerControls;