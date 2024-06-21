import React, { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ src, isPlaying, onPlay, onPause }) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedData = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    // Add beforeunload event listener
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (event) => {
    const seekTime = event.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const progress = (currentTime / duration) * 100 || 0;

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} />
      <button className="play-pause-btn" onClick={handlePlayPause}>
        {isPlaying ? '⏸' : '▶️'}
      </button>
      <span className="time">{formatTime(currentTime)}</span>
      <div className="seek-bar-container">
        <input
          type="range"
          className="seek-bar"
          value={currentTime}
          max={duration || 0}
          onChange={handleSeek}
        />
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="time">{formatTime(duration)}</span>
      <button className="mute-btn" onClick={toggleMute}>
        {isMuted ? '🔇' : '🔊'}
      </button>
      <button className="more-btn">⋮</button>
    </div>
  );
};

export default AudioPlayer;