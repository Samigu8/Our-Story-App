import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import AddMemory from './pages/AddMemory.jsx';
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import LoveNotes from './pages/LoveNotes.jsx';
import Memories from './pages/Memories.jsx';
import Timeline from './pages/Timeline.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/memories/add" element={<AddMemory />} />
          <Route path="/lovenotes" element={<LoveNotes />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
