import React, { useState } from 'react';
import axios from '../utils/api';

export default function CheckIn() {
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/cars', { plate });
      setMessage('Checked in');
      setPlate('');
    } catch (e: any) {
      setMessage(e.response?.data?.error || 'Error');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-sm">
      <input className="w-full border p-2" value={plate} onChange={e=>setPlate(e.target.value)} placeholder="Plate" />
      <button className="bg-green-500 text-white px-4 py-2" type="submit">Check In</button>
      {message && <div>{message}</div>}
    </form>
  );
}
