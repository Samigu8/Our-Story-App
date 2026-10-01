import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import AddMemory from './pages/AddMemory.jsx';
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import LoveNotes from './pages/LoveNotes.jsx';
import Memories from './pages/Memories.jsx';
import Timeline from './pages/Timeline.jsx';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './context/auth.js';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
            <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
            <Route path="/memories/add" element={<ProtectedRoute><AddMemory /></ProtectedRoute>} />
            <Route path="/lovenotes" element={<ProtectedRoute><LoveNotes /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
