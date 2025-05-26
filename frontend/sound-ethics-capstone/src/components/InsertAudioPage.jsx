import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import UploadIcon from '../assets/upload-icon.png';
import InsertAudioBox from '../assets/insert-audio-box.png';

export default function InsertAudioPage() {
  const [uploadStatus, setUploadStatus] = useState('Click Here To Upload Your Audio File.');
  const [borderStyle, setBorderStyle] = useState('border-2 border-[#D6FF62]');
  const [fileDetails, setFileDetails] = useState('');
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'audio/mp3' || file.type === 'audio/mpeg')) {
      const fileURL = URL.createObjectURL(file);
      setUploadStatus(`Successfully uploaded:`);
      setSelectedFile(file);
      setFileDetails(`${file.name}`);
      setBorderStyle('border-10');
      setAudioURL(fileURL);
    } else {
      const fileType = file ? file.type : 'No file selected';
      setUploadStatus(`Upload failed.`);
      setFileDetails(`Detected file type: ${fileType}. Try again.`);
      setBorderStyle('border-4 border-red-500');
      setAudioURL(null);
    }
  };

  const handleSubmit = () => {
    if (fileDetails) {
      console.log(fileDetails)
      navigate('/loadingpage', { state: { file: selectedFile } });
    } else {
      setUploadStatus('No file uploaded.');
      setFileDetails('Please upload a valid audio file.');
      setBorderStyle('border-4 border-red-500');
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((current / duration) * 100);
  };

  return (
    <div className="bg-[#D6FF62] min-h-screen min-w-full flex flex-col p-0 m-0">
      <Header />
      <div id="not-header" className="flex flex-col items-center justify-center w-full flex-grow mt-20">
        <div className="flex flex-col items-center px-4 align-middle">
          <p className="self-start text-left !text-6xl sm:!text-8xl md:!text-9xl lg:!text-9xl font-bold mb-4 fk-screamer text-black">INSERT AUDIO FILE</p>
          <div className="relative flex flex-col items-center justify-center text-[#D6FF62]">
            <img 
              src={InsertAudioBox} 
              alt="Insert Audio Box" 
              className="w-full h-auto object-contain"
            />
            <label 
              htmlFor="audio-upload" 
              className={`absolute flex flex-col items-center justify-center text-center cursor-pointer ${borderStyle} w-3/4 py-5 mt-30`}
            >
              <img src={UploadIcon} alt="Upload Icon" className="mx-auto" />
              <p className="pp-editorial text-xl mt-2">{uploadStatus}</p>
              {fileDetails && (
                <p className="pp-editorial text-2xl">{fileDetails}</p>
              )}
            </label>
            <input
              id="audio-upload"
              type="file"
              accept=".mp3"
              className="hidden"
              onChange={handleUpload}
            />

            
          </div>

          {audioURL && (
            <div className="mt-8 w-full max-w-xl bg-black text-[#D6FF62] p-4 shadow-md">
              <audio
                ref={audioRef}
                src={audioURL}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={togglePlayPause}
                  className="text-2xl fk-screamer font-bold hover:text-gray-300 transition-colors"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <div className="w-full ml-4 h-2 bg-[#D6FF62]/30 rounded">
                  <div
                    className="h-2 bg-[#D6FF62]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center mt-4 fk-screamer">
          <button 
            onClick={handleSubmit}
            className="bg-black text-[#D6FF62] hover:bg-gray-500 transition-colors"
          >
            <p className="font-bold text-3xl py-3 px-6 m-0 cursor-pointer">SUBMIT</p>
          </button>
        </div>
      </div>
    </div>
  );
}