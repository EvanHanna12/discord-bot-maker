import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BotCreator from './pages/BotCreator';
import BotManager from './pages/BotManager';
import Templates from './pages/Templates';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<BotCreator />} />
            <Route path="/manage" element={<BotManager />} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 