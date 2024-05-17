import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import Home from './pages/Home/Home';

const App = () => (
  <Router>
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  </Router>
);

export default App
