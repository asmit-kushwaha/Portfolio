import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import FunHub from './pages/FunHub';
import TicTacToe from './pages/TicTacToe';
import MemoryMatch from './pages/MemoryMatch';
import Now from './pages/Now';
import CommandPalette from './components/CommandPalette';
import HiddenThings from './components/HiddenThings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CommandPalette />
      <HiddenThings />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/asmit" element={<Home />} />
        <Route path="/asmit-kushwaha" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/fun" element={<FunHub />} />
        <Route path="/fun/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/fun/memory" element={<MemoryMatch />} />
        <Route path="/now" element={<Now />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div id="scroll-end-sentinel" style={{ height: 1 }} />
    </div>
  );
}

export default App;