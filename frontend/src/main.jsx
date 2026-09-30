import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../styles/index.css'
import Navbar from './Navbar.jsx'
import Home from './Home.jsx'
import Timeline from './Timeline.jsx'
import Memories from './Memories.jsx'
import LoveNotes from './LoveNotes.jsx'
import Test from './Test.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/lovenotes" element={<LoveNotes />} />
        <Route path="/test" element={<Test />} />
     </Routes>
    </BrowserRouter>
  </StrictMode>,
)
