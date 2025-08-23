import React, { useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Board from './Board';
import CarDetail from './CarDetail';
import CheckIn from './CheckIn';
import axios from '../utils/api';
import { io } from 'socket.io-client';

const socket = io();

export default function App() {
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/api/auth/me').catch(() => navigate('/login'));
  }, []);
  useEffect(() => {
    socket.on('update', () => window.dispatchEvent(new Event('update')));
    return () => { socket.disconnect(); };
  }, []);
  return (
    <div className="p-4 space-y-4">
      <nav className="flex gap-4">
        <Link to="/">Board</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/checkin">Check-in</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/checkin" element={<CheckIn />} />
      </Routes>
    </div>
  );
}
