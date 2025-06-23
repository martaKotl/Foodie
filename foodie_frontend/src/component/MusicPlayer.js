import React, { createContext, useState, useRef, useEffect } from 'react';

export const MusicContext = createContext();

const tracks = [
  { name: 'Bite The Beat', src: '/Bite-the-Beat.mp3' },
  { name: 'Dancing Bite', src: '/Bite-the-Beat.mp3' },
  { name: 'Stayin Full', src: '/Bite-the-Beat.mp3' }
];

export const MusicProvider = ({ children }) => {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(new Audio(tracks[0].src));

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = muted ? 0 : volume;
    audio.onended = handleNextTrack;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[selectedTrackIndex].src;
    audio.load();
    if (isPlaying) audio.play();
  }, [selectedTrackIndex]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackChange = (index) => {
    setSelectedTrackIndex(index);
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
  };

  const handleMuteToggle = () => {
    setMuted(prev => !prev);
  };

  const handleNextTrack = () => {
    const nextIndex = (selectedTrackIndex + 1) % tracks.length;
    setSelectedTrackIndex(nextIndex);
  };

  const stopMusic = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider
      value={{
        tracks,
        selectedTrackIndex,
        isPlaying,
        volume,
        muted,
        togglePlayPause,
        handleTrackChange,
        handleVolumeChange,
        handleMuteToggle,
        stopMusic
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
