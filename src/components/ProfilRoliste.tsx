import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

interface Profil {
  pseudo: string;
  global: object[];
  avatars: number[];
}

// Fonction utilitaire pour capitaliser les textes
const capitalizeText = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const ProfilRoliste = ({ pseudo, arena } : { pseudo: string, arena: number }) => {
  const [profil, setProfil] = useState(null);
  const [fullProfil, setFullProfil] = useState({});

  useEffect(() => {
    // Récupération des données de l'api
    fetch(`http://localhost:8001/stats/profil/${arena}/${pseudo}`)
      .then(res => res.json())
      .then(data => setProfil(data));
    fetch(`http://localhost:8001/stats/profil/${pseudo}`)
      .then(res => res.json())
      .then(data => setFullProfil(data));
  }, [pseudo]);

  if (!profil) return <div>Chargement du profil...</div>;

  return (
    <>
      <div className='p-4 text-white'>
        {/* Titre */}
        <h2>Profil de <b>{capitalizeText(pseudo)}</b> dans l'arène {arena}</h2>
        {/* <h2>Profil de {profil.pseudo} dans l'arène {arena}</h2> */}
        {/* Détails */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* Graphique circulaire : Ratio Global */}
          <div style={{ width: '300px', height: '300px' }}>
            <h3>Ratio Global</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={profil.global} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {profil.global.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique en barres : Performance par Avatar */}
          <div style={{ flex: 1, minWidth: '400px', height: '300px' }}>
            <h3>Détail par Avatar</h3>
            <ResponsiveContainer>
              <BarChart data={profil.avatars}>
                <XAxis dataKey="nom" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip cursor={{fill: '#333'}} />
                <Legend />
                <Bar dataKey="victoires" fill="#2ecc71" name="Victoires" />
                <Bar dataKey="defaites" fill="#e74c3c" name="Défaites" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className='p-4 text-white mt-4'>
        {/* Titre */}
        <h2>Profil complet de <b>{capitalizeText(pseudo)}</b></h2>
        {/* <h2>Profil complet de {fullProfil.pseudo}</h2> */}
        {/* Détails */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* Graphique circulaire : Ratio Global */}
          <div style={{ width: '300px', height: '300px' }}>
            <h3>Ratio Global</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={fullProfil.global} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {fullProfil.global.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique en barres : Performance par Avatar */}
          <div style={{ flex: 1, minWidth: '400px', height: '300px' }}>
            <h3>Détail par Avatar</h3>
            <ResponsiveContainer>
              <BarChart data={fullProfil.avatars}>
                <XAxis dataKey="nom" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip cursor={{fill: '#333'}} />
                <Legend />
                <Bar dataKey="victoires" fill="#2ecc71" name="Victoires" />
                <Bar dataKey="defaites" fill="#e74c3c" name="Défaites" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilRoliste;