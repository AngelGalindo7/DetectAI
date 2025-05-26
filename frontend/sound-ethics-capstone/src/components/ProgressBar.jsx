import React from 'react';
import './LoadingPage.css';

export default function ProgressBar({value, max = 100}) {
    const percentage = Math.min((value/max) * 100, 100);
    return (
        <>
        <div className="custom-progress-container">
        <div className="custom-progress-fill" style={{ width: `${percentage}%` }} >
        <span className="custom-progress-text-inside">{`${Math.round(percentage)}%`}</span>
        </div>
        </div>
        {/*
        // Outer bar
        <div className="w-full bg-lime-200 border-3 border-solid border-black h-8 relative overflow-hidden">
           
            <div
                className="bg-black h-full transition-all duration-300 ease-in-out"
                style={{ width: `${value}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                {`${Math.round(percentage)}%`}
            </span>
        </div>*/}
        </>
    );
}