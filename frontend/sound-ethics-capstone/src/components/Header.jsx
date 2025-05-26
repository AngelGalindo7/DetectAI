import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './header.css';
import SoundEthicsLogoBlack from '../assets/sound-ethics-logo-black.svg'; 
import SoundEthicsLogoGreen from '../assets/sound-ethics-logo-green.svg';
import { motion, AnimatePresence} from 'framer-motion';
import SoundEthicsStage from '../assets/stage.jpg';
import Electricty from '../assets/Electricity-cropped.svg';
export default function Header() {
    const navigate = useNavigate();  // Initialize the navigate function

    const navigateHome = () => {
        navigate('/')
    }

    const navigateGenerate = () => {
        navigate('/generate')
    }
    
    const navigateInsert= () => {
        navigate('/insert')
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = async() => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <div className='fixed mb-15 flex flex-col w-full h-15 items-center fk-screamer-bold z-2'>
            <AnimatePresence mode='wait'>
                {isMenuOpen && (
                    <motion.div
                        className='absolute flex h-screen w-full bg-[#1D1D1D]'
                        initial={{y: '-100%', opacity: 0}}
                        animate={{y: 0,  opacity:1}}
                        exit={{
                            y:'-100%',
                            opacity:0.5,
                            transition: {
                                delay: 0.75,
                                duration: 0.25
                            }
                        }}
                        transition={{
                            duration: 0.25
                        }}
                    >   
                        <div className='relative flex h-full w-1/2 bg-[#1D1D1D] items-center justify-center'>
                            <motion.img 
                                className='absolute h-full w-full bg-[#1D1D1D]'
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{
                                    opacity: 0,
                                    transition: {
                                        duration: 0.25
                                    }
                                }}
                                transition={{ delay:0.75, duration:0.25}}
                                src={SoundEthicsStage}
                            >
                            </motion.img>
                            <img src={Electricty} className='absolute h-full w-full' />
                            <motion.div
                                initial={{x:0}}
                                animate={{x:'100%'}}
                                exit={{
                                    x:0,
                                    transition: {
                                        delay:0.25,
                                        duration: 0.5
                                    }
                                }}
                                transition={{delay:0.25, duration:0.5, ease: 'easeInOut'}}
                                className='absolute inset-0 bg-[#1D1D1D]'
                            />
                        </div>
                        <div className='flex flex-col h-full w-1/2 bg-[#D6FF62] items-center text-black px-3 z-2'>
                            <motion.div 
                                className='relative h-full w-full'
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{
                                    opacity:0,
                                    transition: {
                                        duration: 0.25
                                    }
                                }}
                                transition={{
                                    delay: 1,
                                    duration:0.5
                                }}
                            >
                                <div 
                                    className="absolute flex h-15 w-full text-4xl items-center justify-end" 
                                    onClick={toggleMenu}  // Add click handler
                                    style={{ cursor: 'pointer' }}  // Optionally, add a pointer cursor for clarity
                                >
                                    Close
                                </div>

                                <div className="h-full py-15 w-full flex flex-col items-center justify-center text-9xl gap-4">
                                <div 
                                    onClick={navigateHome} 
                                    className="hover:text-gray-500 transition-colors cursor-pointer"
                                >
                                    Home
                                </div>
                                <div 
                                    onClick={navigateGenerate} 
                                    className="hover:text-gray-500 transition-colors cursor-pointer"
                                >
                                    Generate
                                </div>
                                <div 
                                    onClick={navigateInsert} 
                                    className="hover:text-gray-500 transition-colors cursor-pointer"
                                >
                                    Detect
                                </div>
                                </div>

                            </motion.div>   
                        </div>
                    </motion.div>
                )}    
            </AnimatePresence>
            <div className="flex w-full h-full items-center justify-between bg-black px-3">
                <div className="text-left">
                    <img src={SoundEthicsLogoGreen} id="logo-header" alt="Sound Ethics Logo"/>
                </div>
                <div 
                    className="flex h-full text-4xl items-center justify-center text-[#D6FF62]" 
                    onClick={toggleMenu}  // Add click handler
                    style={{ cursor: 'pointer' }}  // Optionally, add a pointer cursor for clarity
                >
                    MENU
                </div>
            </div>
            <div className='w-full bg-[#1E1E1E] h-0.25 px-3'></div>
        </div>
        
    );
}
