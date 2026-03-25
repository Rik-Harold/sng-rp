'use client';

import React, { useEffect, useState } from 'react';

// Importation des composants
import EvolutionCombats from '@/components/EvolutionCombats';
import StatsArbitrage from '@/components/StatsArbitrage';
import StatsAvatars from '@/components/StatsAvatars';
import ProfilRoliste from '@/components/ProfilRoliste';

const listArenes = [1, 2, 3]

const Dashboard = () => {
    // Variables réactives
  const [dataCombat, setDataCombat] = useState<{ count: number }[]>([]);
  const [dataArbitrage, setDataArbitrage] = useState([]);
  const [dataAvatar, setDataAvatar] = useState([]);
  const [dataRoliste, setDataRoliste] = useState([]);
  const [roliste, setRoliste] = useState("amen");
  const [loading, setLoading] = useState(true);
  const [arene, setArene] = useState(3);

  useEffect(() => {
    fetch(`http://localhost:8001/stats/dashboard/${arene}`)
      .then(res => res.json())
      .then(data => {
        setDataCombat(data.evolution);
        setDataArbitrage(data.arbitres);
        setDataAvatar(data.avatars);
        setDataRoliste(data.rolistes);
        setLoading(false);
      })
      .catch(error => console.error("Erreur API:", error));
  }, [arene]);

  if (loading) return <div className="loader">Chargement du parchemin des stats...</div>;

  return (
    <div className="pt-24 pb-12 text-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="p-5 min-h-screen text-white">
            <div className="mb-8 border-b border-gray-700 pb-5 text-center">
                <h1 className="text-4xl text-orange-500">Tableau de Bord de l'Arène</h1>
                <p className="text-gray-400">Analyse en temps réel des combats et de la productivité.</p>
            </div>

            <div className="text-center space-x-4 m-4">
              {/* Zone de tri */}
              <select
                value={arene}
                onChange={(e) => setArene(parseInt(e.target.value))}
                className="px-4 py-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {listArenes.map(arena => (
                  <option key={arena} value={arena}>Arène {arena}</option>
                ))}
              </select>
            </div>

            {/* Section 1 : Chiffres Clés (Cards) */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-7.5">
                <StatCard title="Total Combats" value={dataCombat.reduce((acc, curr) => acc + curr.count, 0)} color="#8884d8" />
                <StatCard title="Arbitres Actifs" value={dataArbitrage.length} color="#82ca9d" />
                <StatCard title="Avatars Engagés" value={dataAvatar.length} color="#ffc658" />
            </div>

            {/* Section 2 : Graphiques Principaux */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-7.5">
                <div className="chart-container bg-zinc-900 px-5 pb-10 pt-5 rounded-lg">
                <EvolutionCombats arena={arene} />
                </div>
                <div className="chart-container bg-zinc-900 px-5 pb-10 pt-5 rounded-lg">
                <StatsArbitrage dataArbitrage={dataArbitrage} />
                </div>
            </div>

            {/* Section 3 : Performance des Avatars (Pleine largeur) */}
            <div className="mt-7.5 bg-zinc-900 px-5 pb-12 pt-4 rounded-lg">
                <StatsAvatars dataAvatars={dataAvatar} />
            </div>
        </div>

        <div className="mb-8 text-center">
          {/* Zone de sélection */}
          <select
            value={roliste}
            onChange={(e) => setRoliste(e.target.value)}
            className="px-4 py-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {dataRoliste.map((roliste, index) => (
              <option key={index} value={roliste}>{roliste}</option>
            ))}
            {/* {dataRoliste.map((roliste, index) => (
              <option key={index} value={roliste.roliste_id}>{roliste.roliste_id}</option>
            ))} */}
          </select>
        </div>
        {/* Profil */}
        <div className="mt-7.5 bg-zinc-900 px-2 py-8 rounded-lg">
            <ProfilRoliste pseudo={roliste} arena={arene} />
        </div>
      </div>
    </div>
  );
};

// Petit composant interne pour les cartes de stats
const StatCard = ({ title, value, color } : { title: string, value: number, color: string }) => (
  <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', borderLeft: `5px solid ${color}` }}>
    <h4 style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>{title}</h4>
    <p style={{ margin: '10px 0 0 0', fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</p>
  </div>
);

const chartStyle = { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px' };

export default Dashboard;