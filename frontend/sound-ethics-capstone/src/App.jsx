import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './components/LandingPage.jsx'
import InsertAudioPage from './components/InsertAudioPage.jsx'
import LoadingPage from './components/LoadingPage.jsx'
import GenerateSong from './components/GenerateSong.jsx'
import SongAI from './components/SongAI.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DetectedAI from './components/DetectedAI.jsx'
import NoAIDetected from './components/NoAIDetected.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route> 
        <Route path="/generate" element={<GenerateSong/>}></Route>
        <Route path="/songai" element={<SongAI/>}></Route>
        <Route path="/insert" element={<InsertAudioPage/>}></Route>
        <Route path="/loadingpage" element={<LoadingPage/>}></Route>
        <Route path="/detectedai" element={<DetectedAI detected={false}></DetectedAI>}></Route>
        <Route path="/notdetectedai" element={<NoAIDetected detected={true}></NoAIDetected>}></Route>
      </Routes>
    </Router>  
  )
}

export default App;
