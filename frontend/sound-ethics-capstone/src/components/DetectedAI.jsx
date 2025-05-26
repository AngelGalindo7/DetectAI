import * as React from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
export default function DetectedAI({detected}) {
    const navigate = useNavigate();
    
    const navigateGenerate = () => {
        navigate('/generate')
    }

    return (
        <div className="w-full text-[#D6FF62]">
            <Header/>
            <div className='w-full h-full py-15 h-screen flex bg-black justify-center items-center'>
                <div className='flex flex-col w-2/3 h-2/3 justify-center fk-screamer space-y-4'>
                    <div className='text-8xl fk-screamer-bold'>Results</div>
                    <div  className='w-full'>
                        {
                            detected ?
                            <div className='w-full'>
                                <div className='text-5xl fk-screamer-bold'>AI DETECTED</div>
                                <div className="w-full bg-[#A80000] h-3"></div>
                                <div className='text-4xl tracking-wide'>Our model detected AI-generated content in your submission. This audio was likely created using artificial intelligence tools.</div>
                            </div>
                            :
                            <div className='w-full'>
                                <div className='text-5xl fk-screamer-bold'>NO AI DETECTED</div>
                                <div className="w-full bg-[#D6FF62] h-3"></div>
                                <div className='text-4xl tracking-wide'>Our model did not detect AI-generated content in your submission. This audio was likely created by human musicians.</div>
                            </div>
                        }   
                    </div>
                    <div className='flex w-full space-x-3 text-black text-4xl fk-screamer'>
                        <div className='w-1/6 p-1 bg-[#D6FF62] text-center'>
                            NEW FILE
                        </div>

                        <div className='w-1/6 p-1 bg-[#D6FF62] text-center' onClick={navigateGenerate}>
                            GENERATE SONG
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}