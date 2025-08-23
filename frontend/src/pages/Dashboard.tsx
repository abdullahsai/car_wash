import React, { useEffect, useState } from 'react';
import axios from '../utils/api';

type Metrics = { counts: Record<string, number>; averages: Record<string, number>; total: number };

export default function Dashboard() {
  const [data, setData] = useState<Metrics>();
  const load = () => axios.get('/api/metrics/overview').then(r=>setData(r.data));
  useEffect(() => { load(); }, []);
  useEffect(() => { const handler = () => load(); window.addEventListener('update', handler); return ()=>window.removeEventListener('update', handler); }, []);
  if (!data) return <div>Loading...</div>;
  return (
    <div className="space-y-2">
      <div>Total in system: {data.total}</div>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(data.counts).map(stage => (
          <div key={stage} className="p-2 bg-white rounded shadow">
            <div className="font-bold">{stage}</div>
            <div>Count: {data.counts[stage]}</div>
            <div>Avg mins: {data.averages[stage].toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
