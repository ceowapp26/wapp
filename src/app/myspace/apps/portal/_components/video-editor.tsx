import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { PlayCircle, PauseCircle, Upload, Link, FileText, AlignLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const getYoutubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const AdvancedVideoEditor = () => {
  const [videoSource, setVideoSource] = useState('');
  const [videoType, setVideoType] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const playerRef = useRef(null);
  const audioContextRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoSource(URL.createObjectURL(file));
      setVideoType('local');
      extractAndProcessAudio(file);
    }
  };

  const handleYoutubeLink = async (event) => {
    event.preventDefault();
    const youtubeUrl = event.target.youtubeUrl.value;
    if (youtubeUrl) {
      setVideoSource(youtubeUrl);
      setVideoType('youtube');
      const videoId = getYoutubeVideoId(youtubeUrl);
      if (videoId) {
        await processVideo(videoId, 'youtube');
      } else {
        setError('Invalid YouTube URL');
      }
    }
  };

  const extractAndProcessAudio = (videoFile) => {
    setLoading(true);
    setError('');

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const reader = new FileReader();

    reader.onload = async function () {
      const arrayBuffer = reader.result;
      try {
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        const monoWavBlob = audioBufferToMonoWav(audioBuffer);
        await processAudio(monoWavBlob);
      } catch (error) {
        console.error('Error processing audio: ', error);
        setError('Failed to process audio from video');
        setLoading(false);
      }
    };
  
    reader.onerror = function (error) {
      console.error('Error reading file: ', error);
      setError('Failed to read video file');
      setLoading(false);
    };

    reader.readAsArrayBuffer(videoFile);
  };

  const audioBufferToMonoWav = (buffer) => {
    const numberOfChannels = 1; // Force mono
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // Convert to mono by averaging channels
    const offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      let sum = 0;
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        sum += buffer.getChannelData(channel)[i];
      }
      const mono = sum / buffer.numberOfChannels;
      view.setInt16(offset + i * 2, mono < 0 ? mono * 0x8000 : mono * 0x7FFF, true);
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const processAudio = async (audioData) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioData, 'audio.wav');
      formData.append('type', 'local');

      const response = await fetch('/api/transcribe_video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      setTranscript(data.transcript);

      const summaryResponse = await fetch('/api/summarize_transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: data.transcript }),
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to summarize transcript');
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary);
    } catch (err) {
      setError('An error occurred while processing the video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processVideo = async (videoId, type) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('videoId', videoId);
      formData.append('type', type);

      const response = await fetch('/api/transcribe_video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process video');
      }

      const data = await response.json();
      setTranscript(data.transcript);

      const summaryResponse = await fetch('/api/summarize_transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: data.transcript }),
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to summarize transcript');
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary);
    } catch (err) {
      setError('An error occurred while processing the video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSliderChange = (value) => {
    const newTime = (value[0] / 100) * duration;
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Advanced Video Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Video</TabsTrigger>
              <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">MP4, WebM, or Ogg (MAX. 800MB)</p>
                  </div>
                  <Input id="dropzone-file" type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </TabsContent>
            <TabsContent value="youtube">
              <form onSubmit={handleYoutubeLink} className="flex items-center space-x-2">
                <Input type="text" name="youtubeUrl" placeholder="Enter YouTube URL" className="flex-grow" />
                <Button type="submit">
                  <Link className="w-4 h-4 mr-2" />
                  Load
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {videoSource && (
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9">
                <ReactPlayer
                  ref={playerRef}
                  url={videoSource}
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  controls={false}
                />
              </div>
              <div className="flex items-center justify-between">
                <Button onClick={handlePlayPause} variant="outline" size="icon">
                  {isPlaying ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                </Button>
                <div className="flex-grow mx-4">
                  <Slider
                    value={[currentTime / duration * 100]}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={0.1}
                  />
                </div>
                <div className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
          )}
          {loading && (
            <div className="text-center py-4">
              Processing video... This may take a few minutes for longer videos.
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {transcript && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{transcript}</p>
              </CardContent>
            </Card>
          )}
          {summary && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <AlignLeft className="w-5 h-5 mr-2" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{summary}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedVideoEditor;