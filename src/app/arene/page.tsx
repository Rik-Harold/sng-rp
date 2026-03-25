'use client'

// Importation des dépendances
import { motion } from "framer-motion";
import { useState, useEffect } from "react"
import { Search, X } from 'lucide-react'

// Importation de composants
import { FightCard } from "@/components/FightCard"

// Données des articles avec plus de détails
// const articlesNinja = [ ... ];
// import combatsNinja from '@/data/Fight_Arene_3.json';

const API_URL_LOCAL = "http://localhost:3001/sng/liste/article";
const API_URL = "https://datarikbook-api.vercel.app/sng/liste/article";

// --- VARIANTES D'ANIMATION (FRAMER MOTION) ---
const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Apparition en cascade des éléments enfants
    },
  },
};

// Mise à disposition de l'entête
type Fight = {
  fight_id: number;
  keywords: string;
  arena: string;
  start_time: number;
  result_type: string;
  arbitre: string;
  combattant_1: string;
  combattant_2: string;
  combattant_3: string;
  win: string;
  player_win: string;
  lose: string;
  player_lose: string;
  message_count: number;
  end_time: number;
  valid_closure: boolean;
};

const f = {
  "fight_id":1,
  "arena":"arena 3",
  "start_time":1645814940000,
  "result_type":"inconnu",
  "arbitre":"aristarque c. a",
  "combattant_1":"stark",
  "combattant_2":"stark",
  "combattant_3":"inconnu",
  "win":"inconnu",
  "player_win":"inconnu",
  "lose":"inconnu",
  "player_lose":"inconnu",
  "message_count":7,
  "end_time":1647451800000,
  "valid_closure":true
}

export default function Activites() {
  const [fights, setFights] = useState<Fight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Combats');
  const [arene, setArene] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:8001/arene/${arene}/combats`)
      .then(res => res.json())
      .then(data => {
        setFights(data.combats);
      })
  }, [arene]);

  // Catégories d'activités
  const arenes = [0, 1, 2, 3];
  const categories = ['Combats', 'Missions', 'Battle Royale'];

  // Filtrage des activités en fonction de la recherche et du filtre sélectionné
  const filteredActivites = fights.filter((fight: Fight) => {
    const matchesSearch = fight.keywords.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesData = fight.message_count > 0;
    const matchesFilterArene = arene === 1 || arenes.includes(arene);
    const matchesFilterActivity = filter === 'Combats' || categories.includes(filter);
    return matchesSearch && matchesData && matchesFilterArene && matchesFilterActivity;
  });

  return (
    <div className="bg-dark-bg text-white p-6 shadow-lg pt-24 pb-12">
      <Section
        id="characters-list"
        title="Découvrez les Activités"
        description="Explorez la liste complète des personnages de notre communauté. Utilisez les filtres pour trouver votre ninja préféré."
      >
        {/* Zone de filtre */}
        <motion.div
          className="bg-dark-card p-6 rounded-lg mb-12 shadow-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Barre de recherche */}
          <div className="flex items-center border border-border-dark rounded-full px-4 py-2 mb-4 bg-dark-bg focus-within:border-orange-primary transition-all">
            <Search className="text-text-secondary mr-3" />
            <input
              type="text"
              placeholder="Rechercher par personnage, modérateur ou arbitre..."
              className="flex-grow bg-transparent outline-none text-text-light placeholder-text-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-text-secondary hover:text-orange-primary transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
          {/* Zone de tri */}
          <div>
            <select
              value={arene}
              onChange={(e) => setArene(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {arenes.map(aArena => (
                <option key={aArena} value={aArena}>Arène {aArena}</option>
              ))}
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Liste des activités */}
        {filteredActivites.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={cardContainerVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {filteredActivites.map(aFight => (
              <FightCard
                key={aFight.fight_id}
                fight={aFight}
                arene={arene}
              />
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-text-secondary text-lg mt-8"
          >
            Aucune activité ne correspond à votre recherche.
          </motion.p>
        )}
      </Section>
    </div>
  );
}

const Section = ({ id, title, description, children }: { id: string, title: string, description: string, children: React.ReactNode }) => (
  <motion.section
    id={id}
    className="container mx-auto px-6 py-20 text-center"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    // whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <h2 className="text-4xl font-bold mb-4 inline-block border-b-4 border-orange-primary pb-2">{title}</h2>
    <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-12">{description}</p>
    {children}
  </motion.section>
);