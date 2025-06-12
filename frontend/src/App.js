import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainFrontend from './MainFrontend';
import Admin from './Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<MainFrontend />} />
      </Routes>
    </Router>
  );
}

export default App;