import * as React from 'react';
import CustomAudioPlayer from './AudioPlayer';
import { useState, useEffect, useRef } from 'react';
import StyleCarousel from './PresetStyles';
import Header from './Header';
import Note from '../assets/Note.svg'
import { data, useNavigate } from 'react-router-dom';  // Import useNavigate
import { Audio } from 'react-loader-spinner';

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
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const [text, setText] = useState('');
    const [selecetedStyle, setSelectedStyle] = useState(-1);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [songData, setData] = useState(null);
    
    const navigate = useNavigate();

    const navigateSongAI = () => {
      const encodedUrl = encodeURIComponent(audioUrl);
      navigate(`/songai?audio=${encodedUrl}&title=${songData.title}&genre=${songData.genre}`)
    }
    
    useEffect(() => {
      if (audioUrl) {
        navigateSongAI();
      }
    }, [audioUrl]);

    const handleTextChange = (text) => {
      if (selecetedStyle !== -1) {
        setSelectedStyle(-1);  
      }
      setText(text);
    }
    const handleCardChange = (index) => {
      if (text !== "") {
        setText("")
      }
      setSelectedStyle(index);
    }

    const fetchAudio = async () => {
      const prompt = selecetedStyle !== -1 ? musicStyles[selecetedStyle].genre + " " + musicStyles[selecetedStyle].description : text;
      if (!prompt.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        const resp_prompt = await fetch(`${API_BASE_URL}/generate/prompt?prompt=${encodeURIComponent(prompt)}`);
            
        if (!resp_prompt.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await resp_prompt.json();
        const { title, genre } = result;
        setData({ title, genre });

        console.log(result)
        const final_prompt = result.title + " " + result.genre + " " + prompt;
        console.log(final_prompt);
        const response = await fetch(`${API_BASE_URL}/generate/audio?prompt=${encodeURIComponent(final_prompt)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        
        // Clean up previous URL to prevent memory leaks
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        const newAudioUrl = URL.createObjectURL(blob);
        setAudioUrl(newAudioUrl);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching audio:', err);
      } finally {
        setText("");
        setSelectedStyle(-1);
        setIsLoading(false);
      }
    };
    if (isLoading) {
      return (
        <div className='flex flex-col w-full h-screen bg-black fk-screamer items-center text-[#D6FF62] justify-center'>
          <Audio
            height="150"
            width="150"
            radius="9"
            color="#D6FF62"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
          <div className="flex items-center text-4xl">
            <span>Generating Song</span>
            <div className="flex items-center ml-1">
              <style jsx>{`
                @keyframes typing {
                  0% { opacity: 0.2; }
                  20% { opacity: 1; }
                  100% { opacity: 0.2; }
                }
                .typing1 { animation: typing 1.4s infinite; animation-delay: 0s; }
                .typing2 { animation: typing 1.4s infinite; animation-delay: 0.2s; }
                .typing3 { animation: typing 1.4s infinite; animation-delay: 0.4s; }
              `}</style>
              <span className="typing1 text-2xl">.</span>
              <span className="typing2 text-2xl">.</span>
              <span className="typing3 text-2xl">.</span>
            </div>
          </div>
        </div>
      )
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
        <div className='flex flex-col px-3 py-15 w-full items-center bg-[#1E1E1E] fk-screamer space-y-4 z-1'>
            <div className='w-full fk-screamer-bold'>
                <div className='text-4xl'>ENTER YOUR STYLE</div>
                <div>DESCRIBE YOUR SONG STYLE</div>
                <textarea
                    className='w-full mt-2 px-2 py-2 h-30 border-2 border-[#D6FF62] bg-[#313131] text-[#A5A5A5]'
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder='Example: A dark trap beat with 808s and atmospheric synths inspired by dystopian sci-fi'
                >
                </textarea>
            </div>

            <div className='flex flex-col w-full z-1'>
                <div className='text-4xl fk-screamer-bold mb-2'>OR CHOOSE A STYLE PRESET</div>
                <StyleCarousel className="bg-white" selecetedStyle={selecetedStyle} handleCardChange={handleCardChange}/>
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
                        <div className="">{musicStyles[selecetedStyle].description}</div>
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
                onClick={fetchAudio}
            >
                GENERATE SONG
            </div>
        </div>
        <div className='pt-75 bg-black'></div>
      </div>
    );
};