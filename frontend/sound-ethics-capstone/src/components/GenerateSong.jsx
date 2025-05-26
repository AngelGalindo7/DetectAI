import * as React from 'react';
import { useState, useEffect } from 'react';
import StyleCarousel from './PresetStyles';
import Header from './Header';
import Note from '../assets/Note.svg'
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const musicStyles = [
    {
      genre: "Alternative Rock",
      description: "Guitar-driven with introspective lyrics and indie sensibilities"
    },
    {
      genre: "R&B",
      description: "Smooth vocals with soulful melodies and hip-hop influenced production"
    },
    {
      genre: "Jazz",
      description: "Improvisation-heavy with complex harmonies and rhythmic sophistication"
    },
    {
      genre: "Reggaeton",
      description: "Latin urban style with dembow rhythm and Spanish lyrics"
    },
    {
      genre: "Lo-fi Hip Hop",
      description: "Relaxed beats with vinyl crackle and mellow samples"
    },
    {
      genre: "EDM",
      description: "High-energy electronic music with build-ups and bass drops"
    },
    {
      genre: "Indie Folk",
      description: "Acoustic instruments with intimate vocals and storytelling"
    },
    {
      genre: "K-Pop",
      description: "Polished production with catchy hooks and choreographed performances"
    },
    {
      genre: "Ambient",
      description: "Atmospheric soundscapes focusing on texture over melody"
    },
    {
      genre: "Country",
      description: "Narrative lyrics with twangy guitars and traditional American themes"
    }
];

export default function GenerateSong() {
    const [text, setText] = useState('');
    const [selecetedStyle, setSelectedStyle] = useState(-1);
    
    const navigate = useNavigate();
    const navigateSongAI = () => {
        navigate('/songai')
    }

    return (
        <div className="w-full text-[#D6FF62] fk-screamer tracking-wide">
            <Header/>

            <div className='flex flex-col items-center w-full pt-15 bg-black fk-screamer'>
                <div className='flex flex-col py-15 w-2/3 items-center text-center'>
                    <div className='w-full fk-screamer-bold text-7xl'>
                        AI SONG<br/>
                        GENERATOR
                    </div>
                    <div className='w-3/8 text-2xl'>
                        Describe a song style or choose from our presets, and let our AI create a unique track that pushes the boundaries of music
                    </div>
                </div>
            </div>
            <div className='flex flex-col px-3 py-15 w-full items-center bg-[#1E1E1E] fk-screamer space-y-4'>
                <div className='w-full fk-screamer-bold'>
                    <div className='text-4xl'>ENTER YOUR STYLE</div>
                    <div>DESCRIBE YOUR SONG STYLE</div>
                    <textarea
                        className='w-full mt-2 px-2 py-2 h-30 border-2 border-[#D6FF62] bg-[#313131] text-[#A5A5A5]'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Example: A dark trap beat with 808s and atmospheric synths inspired by dystopian sci-fi'
                    >
                    </textarea>
                </div>

                <div className='flex flex-col w-full'>
                    <div className='text-4xl fk-screamer-bold mb-2'>OR CHOOSE A STYLE PRESET</div>
                    <StyleCarousel selecetedStyle={selecetedStyle} setSelectedStyle={setSelectedStyle}/>
                </div>

                <div className='flex w-full items-center text-2xl'>
                    <div className='flex h-12 w-12 border-2 border-[#D6FF62] items-center justify-center p-2'>
                        <img src={Note} alt="" className='h-full' />    
                    </div>
                    <div>
                    {   
                        selecetedStyle !== -1
                        ? 
                        <div className='px-4'>
                            <div className='fk-screamer-bold'>YOUR STYLE: {musicStyles[selecetedStyle].genre}</div>
                            <div className>{musicStyles[selecetedStyle].description}</div>
                        </div>
                        :
                        <div className='px-4'>
                            <div className='fk-screamer-bold'>YOUR STYLE: No Style Selected</div>
                            <div className>Please select a style preset</div>
                        </div>
                    }
                    </div>
                </div>

                <div 
                    className='fk-screamer-bold bg-[#D6FF62] text-2xl text-black mr-auto py-1 px-7'
                    onClick={navigateSongAI}
                >
                    GENERATE SONG
                </div>
            </div>
            <div className='pt-75 bg-black'></div>
        </div>
    );
};