import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import FooterTriangles from '../assets/footer-triangles.png';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#D6FF62] min-h-screen min-w-full flex flex-col flex-grow p-0 m-0">
      <Header />
      <div className="flex flex-col items-center justify-center w-full bg-black text-[#D6FF62] py-20">
        <div className="text-center mt-20">
          <h1 className="!text-[10rem] font-bold fk-screamer-bold m-0 scale-y-150">UC IRVINE CAPSTONE</h1>
          <p className="pp-editorial !text-[1.5rem]">researching and developing AI solutions to protect and preserve artists' voices and creative works</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full">
        <div className="flex gap-10 w-full max-w-6xl px-4 mt-20 mb-20">
          <div className="bg-black text-[#D6FF62] flex flex-col justify-between w-1/2 h-64 p-6">
            <div>
              <h2 className="!text-5xl font-bold fk-screamer-bold tracking-wider scale-y-150">Detect AI</h2>
              <p className="mb-6 text-lg !text-white pp-editorial">Analyze audio files to detect AI-generated content.</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => navigate('/insert')}
                className="bg-[#D6FF62] text-black py-2 px-4 hover:bg-gray-500 transition-colors !text-2xl fk-screamer-bold tracking-wider cursor-pointer">
                START DETECTION
              </button>
            </div>
          </div>

          <div className="bg-black text-[#D6FF62] flex flex-col justify-between w-1/2 h-64 p-6">
            <div>
              <h2 className="!text-5xl font-bold fk-screamer-bold tracking-wider scale-y-150">Generate Music</h2>
              <p className="mb-6 text-lg !text-white pp-editorial">Create unique music tracks powered by AI technology.</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => navigate('/generate')}
                className="bg-[#D6FF62] text-black py-2 px-4 hover:bg-gray-500 transition-colors !text-2xl fk-screamer-bold tracking-wider cursor-pointer">
                CREATE MUSIC
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto w-full">
        <img src={FooterTriangles} alt="Footer Triangles" className="w-full h-auto object-cover" />
      </div>
    </div>
  );
}
