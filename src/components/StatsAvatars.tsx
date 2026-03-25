import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, BarChart } from "recharts";

interface Avatar {
  nom: string;
  combats: number;
  victoires: number;
  defaites: number;
  nuls: number;
}

const StatsAvatars = ({ dataAvatars }: { dataAvatars: Avatar[] }) => {
  // Optionnel : on trie pour afficher les plus actifs en haut  
  const sortedData = [...dataAvatars].sort((a, b) => b.combats - a.combats).slice(0, 10);

  return (
    <div className="mt-4 w-full size-[400]">
      <h3 className="mb-4">Top 10 Avatars (Performance)</h3>
      <ResponsiveContainer>
        <BarChart data={sortedData}>
          <XAxis dataKey="nom" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          {/* On empile les résultats avec stackId="a" */}
          <Bar dataKey="victoires" stackId="a" fill="#4caf50" name="Victoires" />
          <Bar dataKey="defaites" stackId="a" fill="#f44336" name="Défaites" />
          <Bar dataKey="nuls" stackId="a" fill="#9e9e9e" name="Nuls" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsAvatars;