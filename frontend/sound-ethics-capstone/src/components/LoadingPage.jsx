import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import vinyl from '../assets/vinyl.png'; // Ensure the path to your image is correct
import './LoadingPage.css';
import ProgressBar from './ProgressBar';

export default function LoadingPage() {  
  
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('Starting analysis...');
  const navigate = useNavigate();

  // Use React Router's useLocation hook to access state passed from the Insert Audio page
  const location = useLocation();
  const audioFile = location.state?.file; // Access the file from the state

  const jobIdRef = useRef(null);
  const intervalRef = useRef(null);
   const vinylRef = useRef(null);
  const rotationRef = useRef(0); // Track current rotation angle
  const animationFrameRef = useRef(null);
  const spinSpeedRef = useRef(72); // Degrees per second (adjust as needed)
  const lastTimeRef = useRef(0);
  const isAnimatingRef = useRef(false); // Track if animation is running
  let disconnectedSince = null;


  const startPolling = (jobId) => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }


  const interval = setInterval(async () => {
    try {
      const progressResponse = await fetch(`https://audio-api-438198665414.us-central1.run.app/progress/${jobId}`);

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();

        disconnectedSince = null;

        if (progressData.progress !== undefined) {
          setProgress(progressData.progress);
        }

        if (progressData.status) {
          setUploadStatus(progressData.status);
        }

        if (progressData.complete || progressData.progress >= 100) {
          clearInterval(interval);
          intervalRef.current = null;

          setUploadStatus("Analysis complete! Fetching results...");
          await new Promise(res => setTimeout(res, 500));
          await fetchResultsWithRetry(jobId);
        }
      } else {
        if (!disconnectedSince) {
          disconnectedSince = Date.now();
        } else if (Date.now() - disconnectedSince > 5000) {
          setUploadStatus("Server is taking too long to respond. Still retrying...");
        }
      }
    } catch (error) {
      console.warn("Polling error:", error);

      if (!disconnectedSince) {
        disconnectedSince = Date.now();
      } else if (Date.now() - disconnectedSince > 5000) {
        setUploadStatus("Connection lost. Still trying...");
      }
    }
  }, 500);

  intervalRef.current = interval;
};

const fetchResultsWithRetry = async (jobId, retries = 5, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      const resultsResponse = await fetch(`https://audio-api-438198665414.us-central1.run.app/results/${jobId}`);
      const status = resultsResponse.status;

      if (status === 200) {
        const resultsData = await resultsResponse.json();

        setUploadStatus("Results ready! Redirecting...");
        console.log("Results data:", resultsData);

        // 🔍 Make sure the result field matches your backend response (check this)
        const resultLabel = resultsData.label?.toUpperCase(); // or resultsData.result?.toUpperCase()
        const route = resultLabel === "FAKE" ? "/detectedai" : "/notdetectedai";

        setTimeout(() => {
          navigate(route, { state: { data: resultsData } });
        }, 1000);
        return;
      } else if (status === 202) {
        console.log(`Attempt ${i + 1}: Results not ready yet`);
      } else {
        console.log(`Attempt ${i + 1}: Server responded with ${status}`);
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed`, error);
    }

    await new Promise((res) => setTimeout(res, delay));
  }

  setUploadStatus("Failed to retrieve results after multiple attempts.");
};


  // Function to calculate spin speed based on progress
  const getSpinSpeed = () => {
    // Slow down as progress increases (from 90 to 30 degrees per second)
    return 90 - ((progress / 100) * 60);
  };

  // Animation function using requestAnimationFrame for smooth rotation
  const animateVinyl = (timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    
    const elapsed = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Update rotation based on current speed and time elapsed
    rotationRef.current += (spinSpeedRef.current * elapsed) / 1000;
    
    // Apply rotation to vinyl element
    if (vinylRef.current) {
      vinylRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
    }
    
    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(animateVinyl);
  };

  // Start the animation when component mounts or ensures it's running
  const startAnimation = () => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      animationFrameRef.current = requestAnimationFrame(animateVinyl);
    }
  };

  // Stop the animation
  const stopAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      isAnimatingRef.current = false;
    }
  };

  // Start animation on mount
  useEffect(() => {
    startAnimation();
    
    // Cleanup when component unmounts
    return stopAnimation;
  }, []); // Empty dependency array ensures this only runs once on mount

  // Update spin speed when progress changes
  useEffect(() => {
    spinSpeedRef.current = getSpinSpeed();
  }, [progress]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Clear any existing interval when component mounts or unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
      //remove if you dont want to redirect if no file is uploaded
      if(!audioFile) {
        console.error('Upload error');
        setUploadStatus('No file uploaded. Please try again.');
        navigate('/');
        return;
      }

      const uploadAudioFile = async () => {
        try {
          // Prepare FormData to send file to the backend
          const formData = new FormData();
          formData.append('file', audioFile);
          setUploadStatus('Uploading file...');
  
          const response = await fetch('https://audio-api-438198665414.us-central1.run.app/predict', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const responseData = await response.json(); // Assuming the response is in JSON format

            if (responseData.job_id) {
              jobIdRef.current = responseData.job_id;
            setUploadStatus('Processing started. Monitoring progress...');
              startPolling(responseData.job_id);
            }
            else {
              setProgress(100);
              setUploadStatus('Completed');
              navigate('/detectedai', { state: {data:responseData}});
            }
          } else {
            const errorText = await response.text();
            setUploadStatus(`Upload failed: ${errorText || 'Server error'}`);
          }
        } catch (error) {
           console.error('Upload error:', error);
        setUploadStatus('Error uploading file. Check your connection.');
        }
      };

      uploadAudioFile();
    }, [audioFile, navigate]);
  

 
  return (
    <div className="container" id="loading-page-container">
      <Header />

      <div className="loading-main flex w-full">
        <div className="basis-2/5 flex justify-end">
          <img 
            ref={vinylRef}
            src={vinyl} 
            alt="Vinyl" 
            className="loading-vinyl"
          />
        </div>
        <div className="basis-3/5 flex flex-col flex-grow items-start">
            <h2 className="loading-title">
            LOADING RESULTS...
            </h2>
            <div className="progress-wrapper w-full">
              <ProgressBar value={progress} max={100}/>
              {/* <progress
                className="loading-progress"
                value={progress}
                max="100"
              />
              <span className="loading-percent">
                {Math.round(progress)}%
              </span> */}
            </div>
            <p className="loading-status">
              {uploadStatus} 
            </p>
        </div>
        

      </div>
    </div>
  );
}