import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsArbitrage = ({ dataArbitrage }: { dataArbitrage: object[] }) => (
  <div style={{ height: 300, width: '100%', marginTop: '20px' }}>
      <h3 className='mb-4'>Activité des Arbitres</h3>
      <ResponsiveContainer>
        <BarChart data={dataArbitrage} layout="vertical">
          <XAxis type="number" stroke="#ccc" />
          <YAxis dataKey="nom" type="category" stroke="#ccc" width={100} />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Legend />
          {/* "total" représente l'activité globale */}
          <Bar dataKey="total" name="Combats arbitrés" fill="#8884d8" radius={[0, 4, 4, 0]} />
          {/* "clotures_valides" montre la qualité */}
          <Bar dataKey="clotures_valides" name="Clôtures valides" fill="#82ca9d" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
)

export default StatsArbitrage;