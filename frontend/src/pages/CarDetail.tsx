import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';

type Car = any;

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<Car>();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');

  const load = () => axios.get(`/api/cars/${id}`).then(r => setCar(r.data));
  useEffect(() => { load(); }, [id]);

  const pay = async () => {
    await axios.post(`/api/cars/${id}/payments`, { amount: Number(amount), method });
    load();
  };

  if (!car) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">{car.plate}</div>
      <div>Status: {car.status}</div>
      {car.status === 'FINISHED' && (
        <div className="space-y-2">
          <input className="border p-2" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
          <input className="border p-2" placeholder="Method" value={method} onChange={e=>setMethod(e.target.value)} />
          <button className="bg-blue-500 text-white px-4 py-2" onClick={pay}>Record Payment</button>
        </div>
      )}
    </div>
  );
}
