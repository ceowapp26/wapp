"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { RadioGroup } from "@headlessui/react";
import { playSong, selectCurrentTracklist, selectCurrentIndex } from "@/redux/features/apps/music/songsSlice";
import Card from "../card";
import { all, chill, jazzy, sleep } from '@/data/songData';

const LofiTrackContainer = () => {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectCurrentTracklist);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const [playList, setPlaylist] = useState([]);

  useEffect(() => {
    setPlaylist(all);
  }, [setPlaylist]);

  return (
    <RadioGroup value={currentIndex} onChange={(index) => dispatch(playSong({ entities: playList, activeEntity: index, loop: false, looponce: false }))}>
      <div className="flex gap-5 overflow-x-auto px-3 h-200 relative mt-200 pb-50">
        {playList.map((value, index) => (
          <RadioGroup.Option value={index} key={`card-${index}`}>
            {({ checked }) => (
                <Card title={playList[index].name} bg={playList[index].bg} active={checked} url={playList[index].src} askForPlaying={checked} />
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default LofiTrackContainer;




