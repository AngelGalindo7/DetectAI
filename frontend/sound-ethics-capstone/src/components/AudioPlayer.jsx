import React, { useRef, useEffect, useState } from 'react';
import { ImVolumeLow, ImVolumeMedium, ImVolumeHigh, ImVolumeMute2 } from "react-icons/im";
import { data } from 'react-router-dom';

const CustomAudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [frequencyData, setFrequencyData] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // Configure analyser
      analyserRef.current.fftSize = 2048;
      
      // Create source from audio element
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      
      // Connect source to analyser and destination
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const getFrequencyData = () => {
    if (!analyserRef.current) return [];
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    return Array.from(dataArray);
  };

  const analyzeAudio = () => {
    const data = getFrequencyData();
    setFrequencyData(data);
    
    // Update current time
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
    
    // Continue analyzing if audio is playing
    if (audioRef.current && !audioRef.current.paused) {
      animationRef.current = requestAnimationFrame(analyzeAudio);
    } else {
      setIsAnalyzing(false);
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    initializeAudioContext();
    
    // Resume audio context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    setIsAnalyzing(true);
    setIsPlaying(true);
    analyzeAudio();
  };

  const handlePause = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnalyzing(false);
    setIsPlaying(false);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const CircularFrequencyVisualizer = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!canvas || !frequencyData.length) return;
      
      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 40;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Number of bars (use first 64 frequency bins for cleaner look)
      const numBars = 64;
      const angleStep = (2 * Math.PI) / numBars;
      
      for (let i = 0; i < numBars; i++) {
        const angle = i * angleStep - Math.PI / 2; // Start from top
        const barHeight = (frequencyData[i] || 0) / 255 * 120; // Scale bar height
        
        // Calculate bar position
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
        // Set bar color based on frequency intensity
        const intensity = (frequencyData[i] || 0) / 255;
        let color;

        if (intensity < 0.2) {
          color = `hsla(15, 80%, ${20 + intensity * 30}%, 0.7)`; // Dark red-orange
        } else if (intensity < 0.5) {
          color = `hsla(25, 90%, ${45 + intensity * 30}%, 0.9)`; // Bright orange
        } else if (intensity < 0.8) {
          color = `hsla(45, 100%, ${65 + intensity * 25}%, 0.95)`; // Yellow-orange
        } else {
          color = `hsla(60, 80%, ${85 + intensity * 15}%, 1)`; // Hot white-yellow
        }


        ctx.strokeStyle = color;
        
        // Draw bar
        ctx.lineWidth = 4; 
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      
    }, [frequencyData]);
    
    return (
      <canvas 
        ref={canvasRef}
        className="w-[85%] rounded-lg bg-black"
      />
    );
  };

  const seekPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full mx-auto rounded-xl space-x-4 z-2">
      <div className="absolute inset-0 flex items-center justify-center z-5">
        <CircularFrequencyVisualizer />
      </div>
      <audio
        ref={audioRef}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        style={{ display: 'none' }}
      >
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      <div className='flex w-15 h-15 bg-[#D6FF62] items-center justify-center z-10'>
        <div onClick={togglePlayPause}>
          {isPlaying ? 
            <div className="w-6 h-6 flex items-center justify-center gap-1">
              <div className="w-1.5 h-4 bg-black"></div>
              <div className="w-1.5 h-4 bg-black"></div>
            </div>
            : 
            <div className="w-6 h-6 bg-black transform translate-x-0.5" 
              style={{ clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)' }}>
            </div> 
          }
        </div>
      </div>

      <div className='flex-1 w-full z-10'>
        <input
          type="range"
          min="0"
          max="100"
          value={seekPercentage}
          onChange={handleSeek}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer no-thumb slider"
          style={{
            background: `linear-gradient(to right, #D6FF62 0%, #D6FF62 ${seekPercentage}%, #1E1E1E ${seekPercentage}%, #1E1E1E 100%)`
          }}
        />
        <div className='flex justify-between mt-2'>
          <div>{formatTime(currentTime)}</div>
          <div>{formatTime(duration)}</div>
        </div>
      </div>

      {/* Volume Control */}
      <div className='flex items-center space-x-2 z-10'>
        {/* Volume Icon/Mute Button */}
        <div 
          onClick={toggleMute}
          className='cursor-pointer w-8 h-8 flex items-center justify-center'
        >
          {isMuted || volume === 0 ? (
            // Muted icon
            <ImVolumeMute2/>
          ) : volume < 0.33 ? (
            // Low volume icon
            <ImVolumeLow/>
          ) : volume < 0.67 ? (
            // Med volume icon
            <ImVolumeMedium/>
          ) : (
            // High volume icon
            <ImVolumeHigh/>
          )}
        </div>

        {/* Volume Slider */}
        <div className='w-20 relative z-10'>
          <div className="w-full h-1.5 bg-[#1E1E1E] rounded-lg relative overflow-hidden">
            <div 
              className="h-full bg-[#D6FF62] transition-all duration-100"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div 
            className="absolute top-1/2 w-4 h-4 bg-[#D6FF62] rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        .no-thumb::-webkit-slider-thumb {
          opacity: 0;
        }
        .no-thumb::-moz-range-thumb {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default CustomAudioPlayer;