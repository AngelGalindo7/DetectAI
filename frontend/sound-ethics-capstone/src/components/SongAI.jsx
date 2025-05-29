import * as React from 'react';
import { useState, useEffect } from 'react';
import Header from './Header';
import { ImVolumeLow, ImShare2, ImDownload3 } from "react-icons/im";
import { RiAiGenerate2 } from "react-icons/ri";
import { SiDowndetector } from "react-icons/si";
import CustomAudioPlayer from './AudioPlayer'
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const song = {
    title: "Midnight Cascade",
    style: "Trap Wave",
    duration: "3:27",
    generatedDate: "May 12, 2025",
    tempo: "95 BPM",
    mood: "DREAMY, HYPNOTIC",
    key: "D MINOR",
    instruments: "808S, SYNTH PADS, BELLS",
    vocalType: "FEMALE - AUTOTUNED",
    description: "Heavy bass with ethereal melodies and haunting vocal samples",
    aiGenerated: true,
    producer: "SOUND ETHICS",
    lyrics: [
      "Floating through the neon skies",
      "Digital dreams materialize",
      "Echoes of a distant time",
      "Memories in my mind crystallize",
      "\n",
      "Midnight cascade, digital rain",
      "Synthetic emotions, pleasure and pain",
      "Flowing through circuits, electric veins",
      "Nothing is real, everything remains"
    ],
    waveform: "://||||||||||||||||||||||||:", // ASCII representation of waveform
    currentTime: "0:00",
    tags: ["electronic", "ambient", "futuristic", "melancholic"]
};

export default function SongAI() {
    const navigate = useNavigate();  // Initialize the navigate function
    const navigateGenerate = () => {
        navigate('/generate')
    }
    const navigateInsert= () => {
        navigate('/insert')
    }

    const [searchParams] = useSearchParams();
  
    const audioUrl = decodeURIComponent(searchParams.get('audio') || '');
    const title = decodeURIComponent(searchParams.get('title') || '');
    const genre = decodeURIComponent(searchParams.get('genre') || '');
    const today = new Date().toISOString().split('T')[0];

    const downloadAudio = async () => {
        if (!audioUrl) {
            alert('No audio file available to download');
            return;
        }

        try {
            // Show loading state (optional)
            console.log('Starting download...');
            
            // Fetch the audio data
            const response = await fetch(audioUrl);
            
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get the audio data as a blob
            const blob = await response.blob();
            
            // Create a download URL
            const downloadUrl = window.URL.createObjectURL(blob);
            
            // Extract filename from URL or use default
            const filename = getFilenameFromUrl(audioUrl) || 'audio-download.mp3';
            
            // Create and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            
            console.log('Download completed');
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        }
        };

        const getFilenameFromUrl = (url) => {
            try {
                const pathname = new URL(url).pathname;
                return 'audio-file.mp3';
            } catch {
                return 'audio-file.mp3';
            }
        };

    return (
        <div className="relative flex w-full text-[#D6FF62] bg-black fk-screamer tracking-wide">
            <Header/>
            <div className='flex mx-auto justify-center flex-col w-[60%] px-3 pt-15 bg-black fk-screamer min-h-screen space-y-10 z-1'>
                <div className='text-8xl fk-screamer-bold z-10'>{title}</div>
                
                <div className='flex text-2xl fk-screamer-bold space-x-5 z-10'>
                    <div>{genre}</div>
                    <div>GENERATED {today}</div>
                </div>
                
                <CustomAudioPlayer audioUrl={audioUrl}></CustomAudioPlayer>

                <div className='flex w-full text-xl text-black space-x-3 fk-screamer-bold  z-10'>
                    <div 
                        className='flex w-1/6 items-center justify-center bg-[#D6FF62] py-2 px-2 space-x-2'
                        onClick={downloadAudio}
                    >
                        <ImDownload3/>
                        <div>DOWNLOAD</div>
                    </div>
                    <div 
                        className='flex w-1/6 items-center justify-center bg-[#D6FF62] py-2 px-2 space-x-2'
                        onClick={navigateGenerate}
                    >
                        <RiAiGenerate2/>
                        <div>REGENERATE</div>
                    </div>
                    <div 
                        className='flex w-1/6 items-center justify-center bg-[#D6FF62] py-2 px-2 space-x-2'
                        onClick={navigateInsert}
                    >
                        <SiDowndetector/>
                        <div>DETECT AI</div>
                    </div>
                </div>
            </div>
        </div>
    )
}