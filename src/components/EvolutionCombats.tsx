import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const API = {
  local: 'http://localhost:8001',
  ligne: '',
  url: 'stats/evolution'
}

const EvolutionCombats = ({ arena } : { arena: number }) => {
  const [dataCombat, setDataCombat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState('2022');

  useEffect(() => {
    // Appel à ton API Python
    fetch(`${API.local}/${API.url}/${arena}/${year}`)
      .then(response => response.json())
      .then(stats => {
        setDataCombat(stats.evolution);
        setLoading(false);
      })
      .catch(error => console.error("Erreur API:", error));
  }, [year]);

  if (loading) return <p>Chargement des statistiques...</p>;

  return (
    <div style={{ width: '100%', height: 400, backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px' }}>
      <h2 className='text-white mb-4'>Évolution des Combats</h2>
      <div className='mb-4'>
        <label style={{ color: '#fff', marginRight: '10px' }}>Choisir l'année :</label>
        <select 
          value={year} 
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px' }}
        >
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dataCombat}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="date" 
            stroke="#ccc" 
            tick={{fill: '#ccc'}} 
          />
          <YAxis stroke="#ccc" tick={{fill: '#ccc'}} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }}
            itemStyle={{ color: '#8884d8' }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorCount)" 
            name="Nombre de combats"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvolutionCombats;