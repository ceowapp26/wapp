import React, { useState } from 'react';

const VideoEditor = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.createRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedData = () => {
    setDuration(videoRef.current.duration);
  };

  return (
    <div>
      <h2 className="font-bold text-xl text-black py-4">Video Editor</h2>
      <input type="file" onChange={handleFileChange} accept="video/*" />
      {videoUrl && (
        <div>
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleLoadedData}
          />
          <div>
            <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <p>Current Time: {currentTime.toFixed(2)}s / Duration: {duration.toFixed(2)}s</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoEditor;