import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}