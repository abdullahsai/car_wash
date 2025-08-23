import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/login', { username, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4 w-80">
        <h1 className="text-xl font-bold">Login</h1>
        {error && <div className="text-red-500">{error}</div>}
        <input className="w-full border p-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="password" className="w-full border p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2 w-full" type="submit">Login</button>
      </form>
    </div>
  );
}
