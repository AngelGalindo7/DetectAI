import * as React from 'react';
import { useState, useEffect } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 4
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 4
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 5
    }
};

export function StyleCard({style}) {
    <div className='h-100 flex flex-col items-center justify-center'>
        <div>{style.genre}</div>
        <div>{style.description}</div>
    </div>
}

export default function StyleCarousel({selecetedStyle, setSelectedStyle}) {
    const handleSelect = (index) => {
        // If clicking the same box, toggle selection
        if (selecetedStyle !== index) {
          setSelectedStyle(index);
        }
        else {
            setSelectedStyle(-1);
        }
      };

    return (
        <Carousel responsive={responsive}>
            {musicStyles.map((style, index) => (
                <div 
                    onClick={() => handleSelect(index)}
                    className={
                        `h-full px-4 flex flex-col py-3
                        ${selecetedStyle === index 
                            ? 'border-2 border-[#D6FF62]'
                            : ''
                        }
                    `}
                >
                    <div className='fk-screamer-bold text-2xl'>{style.genre}</div>
                    <div className='text-xl'>{style.description}</div>
                </div>
            ))}
        </Carousel>
    );
};