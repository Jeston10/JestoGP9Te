import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Wallet from '../pages/Wallet';
import Blockchain from '../pages/Blockchain';
import Mining from '../pages/Mining';
import Tokens from '../pages/Tokens';
import Peer from './pages/Peer';
import Transaction from '../pages/Transaction';
import Dashboard from '../pages/Dashboard';
import Navbar from './components/Navbar';
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/blockchain" element={<Blockchain />} />
        <Route path="/mining" element={<Mining />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/peers" element={<Peer />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;