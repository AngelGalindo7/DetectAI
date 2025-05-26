import * as React from 'react';
import { useState, useEffect } from 'react';
import Header from './Header';
import { ImVolumeLow } from "react-icons/im";


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
    return (
        <div className="w-full text-[#D6FF62] fk-screamer tracking-wide">
            <Header/>
            <div className='flex flex-col w-full px-3 pt-15 bg-black fk-screamer space-y-10'>
                <div className='flex w-full items-center justify-between'>
                    <div class=" 
                        border-l-[0px] border-l-transparent
                        border-t-[50px] border-[#D6FF62]
                        border-r-[50px] border-r-transparent">
                    </div>
                    <div className='text-lg px-4 text-black bg-[#D6FF62] fk-screamer-bold'>AI GENERATED</div>
                </div>

                <div className='text-8xl fk-screamer-bold'>{song.title}</div>
                
                <div className='flex text-2xl fk-screamer-bold space-x-5'>
                    <div>{song.style}</div>
                    <div>{song.duration}</div>
                    <div>GENERATED {song.generatedDate}</div>
                </div>

                <div className='border-2 border-[#D6FF62] h-40 mt-30 bg-[#1E1E1E]'>

                </div>

                <div className='flex w-full items-center space-x-4'>
                    <div className='flex w-15 h-15 bg-[#D6FF62] items-center justify-center'>
                        <div className="w-6 h-6 bg-black transform translate-x-0.5" 
                            style={{ clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)' }}>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='h-3 bg-[#1E1E1E]'></div>
                        <div className='flex justify-between'>
                            <div>{song.currentTime}</div>
                            <div>{song.duration}</div>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <ImVolumeLow/>
                        <div className='w-20 h-2 bg-[#1E1E1E]'></div>
                    </div>
                </div>

                <div className='flex flex-col w-full bg-[#1E1E1E] py-10 px-25 items-center text-2xl space-y-20'>
                    <div className='flex w-full'>
                        <div className='w-1/3'>
                            <div>STYLE</div>
                            <div className='text-4xl fk-screamer-bold'>{song.style}</div>
                        </div>
                        <div className='w-1/3'>
                            <div>TEMPO</div>
                            <div className='text-4xl fk-screamer-bold'>{song.tempo}</div>
                        </div>
                        <div className='w-1/3'>
                            <div>MOOD</div>
                            <div className='text-4xl fk-screamer-bold'>{song.mood}</div>
                        </div>
                    </div>
                    <div className='flex w-full'>
                        <div className='w-1/3'>
                            <div>KEY</div>
                            <div className='text-4xl fk-screamer-bold'>{song.key}</div>
                        </div>
                        <div className='w-1/3'>
                            <div>INSTRUMENTS</div>
                            <div className='text-4xl fk-screamer-bold'>{song.instruments}</div>
                        </div>
                        <div className='w-1/3'>
                            <div>VOCAL TYPE</div>
                            <div className='text-4xl fk-screamer-bold'>{song.vocalType}</div>
                        </div>
                    </div>
                </div>

                <div className='flex w-full text-xl text-black space-x-3 fk-screamer-bold'>
                    <div className='bg-[#D6FF62] py-2 px-15'>
                        <div></div>
                        <div>SHARE</div>
                    </div>
                    <div className='bg-[#D6FF62] py-2 px-15'>
                        <div></div>
                        <div>DOWNLOAD</div>
                    </div>
                    <div className='bg-[#D6FF62] py-2 px-15'>
                        <div></div>
                        <div>REGENERATE</div>
                    </div>
                    <div className='bg-[#D6FF62] py-2 px-15'>
                        <div></div>
                        <div>DETECT AI</div>
                    </div>
                </div>

                <div className='text-6xl fk-screamer-bold'>LYRICS</div>
                
                <div className='bg-[#1E1E1E] text-3xl p-5'>
                    {song.lyrics.map((line, index) => (
                    <div>{line}</div>
                ))}
                </div>

            </div>
        </div>
    )
}