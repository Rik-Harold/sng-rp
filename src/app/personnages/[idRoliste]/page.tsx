'use client';

// Importation de dépendances nécessaires
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';

// Importation des composants personnalisés

// Importation des fonctions de formatage
import { capitalizeFirstLetter } from '@/middlewares/formatfunctions';

import CharacterDetail from '@/components/CharacterDetail';

const API_URL_LOCAL = "http://localhost:3001/sng/liste/avatars/sng";
const API_URL = "https://datarikbook-api.vercel.app/sng/liste/avatars/sng";

// Types pour l'API
type ApiCharacter = {
  id: string;
  mort: boolean;
  clan: string;
  name: string;
  pays: string;
  village: string;
  age: number;
  grade: string;
  statut: string;
  roliste: string;
  images: {
    principale: string;
    toutes: string[];
  };
};

type ApiResponse = {
  ok: boolean;
  liste: ApiCharacter[];
};

// Type pour les personnages locaux (après conversion depuis l'API)
type LocalCharacter = {
  id: string;
  rolist: string;
  userTag: string;
  image: string;
  clanFamily: string;
  avatarName: string;
  originCountry: string;
  currentVillage: string;
  kinship: string;
  age: number;
  height: number;
  grade: string;
  level: number;
  chakraNatures: string[];
  specialCapacity: string;
  specialization: string;
  hereditaryCapacity: string[];
  ninjaSkills: {
    agility: { current: number; max: number };
    speed: { current: number; max: number };
    precision: { current: number; max: number };
    reactivity: { current: number; max: number };
    endurance: { current: number; max: number };
    bruteForce: { current: number; max: number };
    psychicGrip: { current: number; max: number };
    sensoryCapacities: { current: number; max: number };
  };
  ninjaEquipment: Array<{ name: string; quantity: number }>;
  palmares: { [key: string]: number | string };
  jutsu: Array<{ rank: string; name: string; custom?: boolean }>;
  ninjaExperience: Array<{ date: string; description: string }>;
  rewardsToApply: Array<{ type: string; name?: string; value?: number | string }>;
  newExperienceDate: string;
  newExperienceDescription: string;
};

// Composant MessageBox personnalisé
type MessageBoxProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

function MessageBox({ message, type, onClose }: MessageBoxProps) {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const textColor = 'text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-28 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg ${bgColor} ${textColor} z-50 flex items-center`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold">
        &times;
      </button>
    </motion.div>
  );
}

// Composant pour afficher une carte de personnage dans la liste
function CharacterCard({ character, onSelect }: { character: LocalCharacter; onSelect: (character: LocalCharacter) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => onSelect(character)}
      className="bg-gray-800 rounded-lg p-6 flex flex-col items-center cursor-pointer shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-300"
    >
      <img
        src={character.image}
        alt={character.avatarName}
        className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-500 shadow-lg"
        onError={(e) => { 
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = 'https://placehold.co/150x150/555555/ffffff?text=Image';
        }} // Fallback image
      />
      <h3 className="text-2xl font-bold text-blue-300 mb-2">{capitalizeFirstLetter(character.avatarName)}</h3>
      <p className="text-gray-400 text-lg">Village: <span className="font-semibold text-white">{character.currentVillage}</span></p>
      <p className="text-gray-400 text-lg">Grade: <span className="font-semibold text-white">{character.grade}</span></p>
    </motion.div>
  );
}

type Character = {
  id: string;
  avatarName: string;
  image: string;
  level: number;
  grade: string;
  rolist: string;
  userTag: string;
  clanFamily: string;
  originCountry: string;
  currentVillage: string;
  kinship: string;
  age: number;
  height: number;
  chakraNatures: string[];
  specialCapacity: string;
  specialization: string;
  hereditaryCapacity: string[];
  ninjaSkills: {
    agility: { current: number; max: number };
    speed: { current: number; max: number };
    precision: { current: number; max: number };
    reactivity: { current: number; max: number };
    endurance: { current: number; max: number };
    bruteForce: { current: number; max: number };
    psychicGrip: { current: number; max: number };
    sensoryCapacities: { current: number; max: number };
  };
  rewardsToApply: Array<{ type: string; name?: string; value?: number | string }>;
  ninjaEquipment: Array<{ name: string; quantity: number }>;
  palmares: { [key: string]: number | string };
  jutsu: Array<{ rank: string; name: string; custom?: boolean }>;
  ninjaExperience: Array<{ date: string; description: string }>;
  newExperienceDate: string;
  newExperienceDescription: string;
};

export default function Page() {
  const params = useParams();
  const rolistId = decodeURIComponent(params.idRoliste as string);
  
  const [characters, setCharacters] = useState<LocalCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageBox, setMessageBox] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [loadingCharacter, setLoadingCharacter] = useState(false);

  // Fonction pour convertir les données de l'API vers le format local
  const convertApiCharacterToLocal = (apiChar: ApiCharacter): LocalCharacter => {
    return {
      id: apiChar.id,
      rolist: apiChar.roliste,
      userTag: `@${apiChar.roliste}`,
      image: apiChar.images.principale ? `/avatars/profil/${apiChar.images.principale}` : 'https://placehold.co/150x150/555555/ffffff?text=Image',
      clanFamily: apiChar.clan,
      avatarName: apiChar.name,
      originCountry: apiChar.pays,
      currentVillage: apiChar.village,
      kinship: 'Inconnu',
      age: apiChar.age,
      height: 1.70, // Valeur par défaut
      grade: apiChar.grade,
      level: 1, // Valeur par défaut
      chakraNatures: [],
      specialCapacity: 'Aucune',
      specialization: 'Aucune',
      hereditaryCapacity: [],
      ninjaSkills: {
        agility: { current: 25, max: 300 },
        speed: { current: 25, max: 300 },
        precision: { current: 25, max: 300 },
        reactivity: { current: 25, max: 300 },
        endurance: { current: 30, max: 500 },
        bruteForce: { current: 25, max: 200 },
        psychicGrip: { current: 25, max: 200 },
        sensoryCapacities: { current: 25, max: 500 },
      },
      ninjaEquipment: [],
      palmares: {
        'Combats gagnés': 0,
        'Total combats': 0,
        'Tournois gagnés': 0,
        'Total tournois': 0,
        'Missions S remplies': 0,
        'Total missions S': 0,
        'Missions A remplies': 0,
        'Total missions A': 0,
        'Missions B remplies': 0,
        'Total missions B': 0,
        'Missions C remplies': 0,
        'Total missions C': 0,
        'Missions D remplies': 0,
        'Total missions D': 0,
        'Missions E remplies': 0,
        'Total missions E': 0,
      },
      jutsu: [],
      ninjaExperience: [
        { date: new Date().toLocaleDateString('fr-FR'), description: 'Intégration à la communauté' }
      ],
      rewardsToApply: [],
      newExperienceDate: '',
      newExperienceDescription: '',
    };
  };

  // Fonction pour convertir LocalCharacter vers Character (pour le composant CharacterDetail)
  const convertLocalToCharacter = (localChar: LocalCharacter): any => {
    return {
      ...localChar,
      // Assurez-vous que tous les champs requis par CharacterDetail sont présents
    };
  };

  // Fonction pour convertir Character vers LocalCharacter (depuis CharacterDetail)
  const convertCharacterToLocal = (char: any): LocalCharacter => {
    return {
      ...char,
      // Assurez-vous que tous les champs requis par LocalCharacter sont présents
    };
  };

  // Appel API pour charger les personnages
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!rolistId) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        const data: ApiResponse = await response.json();
        
        if (data.ok && data.liste) {
          // Filtrer les personnages par rôliste et convertir le format
          const filteredCharacters = data.liste
            .filter(char => char.roliste.toLowerCase() === rolistId.toLowerCase())
            .map(convertApiCharacterToLocal);
          
          setCharacters(filteredCharacters);
          
          if (filteredCharacters.length === 0) {
            setError(`Aucun personnage trouvé pour le rôliste "${rolistId}"`);
          }
        } else {
          setError("Erreur lors du chargement des personnages depuis l'API.");
        }
      } catch (err) {
        setError("Erreur de connexion à l'API.");
        console.error("Erreur de chargement des personnages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [rolistId]);

  // Fonction pour sélectionner un personnage et charger dynamiquement ses infos depuis l'API
  const handleSelectCharacter = async (character: LocalCharacter) => {
    setLoadingCharacter(true);
    try {
      // const res = await fetch(`http://localhost:3001/sng/liste/avatars/actif/${character.avatarName}`);
      const res = await fetch(`https://datarikbook-api.vercel.app/sng/liste/avatars/actif/${character.avatarName}`);
      const data = await res.json();
      if (data.ok && data.avatar) {
        setSelectedCharacter(convertApiAvatarToCharacter(data.avatar));
      } else {
        setSelectedCharacter(null);
        setMessageBox({ show: true, message: 'Erreur lors de la récupération de la fiche personnage.', type: 'error' });
      }
    } catch (e) {
      setSelectedCharacter(null);
      setMessageBox({ show: true, message: 'Erreur de connexion à l\'API.', type: 'error' });
    } finally {
      setLoadingCharacter(false);
    }
  };

  // Fonction pour revenir à la liste des personnages
  const handleBackToList = () => {
    setSelectedCharacter(null);
  };

  // Fonction pour mettre à jour un personnage (simule un appel PATCH/PUT à l'API)
  const handleUpdateCharacter = async (updatedCharacter: LocalCharacter) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Ici, tu ferais un `fetch('/api/personnages/' + updatedCharacter.id, { method: 'PUT', body: JSON.stringify(updatedCharacter), headers: { 'Content-Type': 'application/json' } })`
      // et traiterais la réponse.
      setCharacters(prevChars =>
        prevChars.map(char =>
          char.id === updatedCharacter.id ? updatedCharacter : char
        )
      );
      setSelectedCharacter(updatedCharacter); // Met à jour le personnage sélectionné
      setMessageBox({ show: true, message: 'Fiche du personnage mise à jour avec succès !', type: 'success' });
    } catch (err) {
      setError("Erreur lors de la mise à jour du personnage.");
      console.error("Erreur de mise à jour du personnage:", err);
      setMessageBox({ show: true, message: 'Erreur lors de la mise à jour de la fiche.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour copier les informations du personnage dans le presse-papiers
  const handleShareCharacter = (character: LocalCharacter) => {
    const ninjaSkillsFormatted = Object.entries(character.ninjaSkills)
      .map(([key, value]) => {
        const labelMap = {
          agility: 'Agilité', speed: 'Vitesse', precision: 'Précision', reactivity: 'Réactivité',
          endurance: 'Endurance', bruteForce: 'Force brute', psychicGrip: 'Étreinte Psychique',
          sensoryCapacities: 'Capacités sensorielles'
        };
        type SkillKey = keyof typeof labelMap;
        const skillKey = key as SkillKey;
        const skillValue = value as { current: number; max: number };
        return `○ ${labelMap[skillKey]} ${' '.repeat(30 - labelMap[skillKey].length)}: ${skillValue.current}/${skillValue.max}`;
      })
      .join('\n');

    const jutsuList = character.jutsu
      .map((j: { rank: string; name: string; custom?: boolean }) => `▪【${j.rank}】: ${j.name}`)
      .join('\n');

    const experienceList = character.ninjaExperience
      .map((exp: { date: string; description: string }) => `• ${exp.date} : ${exp.description}`)
      .join('\n');

    const equipmentList = character.ninjaEquipment
      .map((item: { name: string; quantity: number }) => `~ ${item.name} x${item.quantity}`)
      .join('\n');

    const chakraValue = calculateChakra(character.ninjaSkills.endurance.current);

    const ficheText = `
▃▅▆ FICHE AVATAR ▆▅▃

Clan/Famille : ${character.clanFamily}
Nom d'avatar : ${character.avatarName}
Pays d'origine : ${character.originCountry}
Village actuel : ${character.currentVillage}

Lien de parenté : ${character.kinship}

Âge : ${character.age}ans
Taille : ${character.height}m
Grade : ${character.grade}
Rôliste : ${character.rolist}
User : ${character.userTag}

Nᴀᴛᴜʀᴇ(s) ᴅᴇ ᴄʜᴀᴋʀᴀ
${character.chakraNatures.map((nature: string) => `+ ${nature}`).join('\n')}

Cap. spéciale : ${character.specialCapacity}
Spécialisation : ${character.specialization}
Cap. Héréditaire(s) : ${character.hereditaryCapacity.join(', ') || 'Aucune'}

ᏟϴᎷᏢᎬͲᎬΝᏟᎬՏ ΝᏆΝᎫᎪ - ${chakraValue} UC
${ninjaSkillsFormatted}

Ꭼ́ϘႮᏆᏢᎬᎷᎬΝͲՏ ΝᏆΝᎫᎪ
${equipmentList || 'Aucun équipement'}

╚»★ PALMARES ★«╝
${Object.entries(character.palmares).map(([key, value]) => `▪${key} : ${value}`).join('\n')}

・・・・ ᎫႮͲՏႮ【${character.jutsu.length}】・・・・
${jutsuList || 'Aucun jutsu maîtrisé'}

░█ EXPÉRIENCE NINJA █░
${experienceList}
    `;

    const el = document.createElement('textarea');
    el.value = ficheText;
    document.body.appendChild(el);
    el.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setMessageBox({ show: true, message: 'Fiche copiée dans le presse-papiers ! Collez-la dans votre groupe WhatsApp.', type: 'success' });
      } else {
        setMessageBox({ show: true, message: 'Impossible de copier la fiche. Veuillez la copier manuellement.', type: 'error' });
      }
    } catch (err) {
      console.error('Erreur lors de la copie: ', err);
      setMessageBox({ show: true, message: 'Erreur lors de la copie de la fiche. Veuillez vérifier les permissions de votre navigateur.', type: 'error' });
    }
    document.body.removeChild(el);
  };

  // Helper pour calculer les Unités de Chakra (congrue à 0 modulo 5)
  const calculateChakra = (endurance: number) => {
    return endurance - (endurance % 5);
  };

  // Conversion API -> Character complet pour CharacterDetail
  const convertApiAvatarToCharacter = (api: any): Character => ({
    id: api._id,
    avatarName: api.name,
    image: api.image?.principale ? `/avatars/profil/${api.image.principale}` : '',
    level: 1,
    grade: api.grade,
    rolist: api.roliste,
    userTag: api.utilisateur?.toString() ?? '',
    clanFamily: api.clan,
    originCountry: api.pays,
    currentVillage: api.village,
    kinship: api.lien,
    age: api.age,
    height: api.taille,
    chakraNatures: api.affinite ?? [],
    specialCapacity: api.capacite?.speciale ?? '',
    specialization: '', // à compléter si besoin
    hereditaryCapacity: api.capacite?.hereditaire ?? [],
    ninjaSkills: {
      agility: { current: api.competences?.vitesse?.total ?? 0, max: api.competences?.vitesse?.total ?? 0 },
      speed: { current: api.competences?.vitesse?.total ?? 0, max: api.competences?.vitesse?.total ?? 0 },
      precision: { current: api.competences?.precision ?? 0, max: api.competences?.precision ?? 0 },
      reactivity: { current: api.competences?.reactivite ?? 0, max: api.competences?.reactivite ?? 0 },
      endurance: { current: api.competences?.endurance ?? 0, max: api.competences?.endurance ?? 0 },
      bruteForce: { current: api.competences?.force_brute ?? 0, max: api.competences?.force_brute ?? 0 },
      psychicGrip: { current: api.competences?.etreinte ?? 0, max: api.competences?.etreinte ?? 0 },
      sensoryCapacities: { current: api.competences?.sensorielles ?? 0, max: api.competences?.sensorielles ?? 0 },
    },
    ninjaEquipment: (api.equipements ?? []).map((eq: any) => ({
      name: eq.name,
      quantity: eq.nb,
    })),
    palmares: {
      'Combats gagnés': api.stats_ninja?.combats?.gagne ?? 0,
      'Total combats': api.stats_ninja?.combats?.tout ?? 0,
      'Tournois gagnés': api.stats_ninja?.tournois?.gagnes ?? 0,
      'Total tournois': api.stats_ninja?.tournois?.tout ?? 0,
      'Missions S remplies': api.stats_ninja?.missions?.rang_s?.remplie ?? 0,
      'Total missions S': api.stats_ninja?.missions?.rang_s?.total ?? 0,
      'Missions A remplies': api.stats_ninja?.missions?.rang_a?.remplie ?? 0,
      'Total missions A': api.stats_ninja?.missions?.rang_a?.total ?? 0,
      'Missions B remplies': api.stats_ninja?.missions?.rang_b?.remplie ?? 0,
      'Total missions B': api.stats_ninja?.missions?.rang_b?.total ?? 0,
      'Missions C remplies': api.stats_ninja?.missions?.rang_c?.remplie ?? 0,
      'Total missions C': api.stats_ninja?.missions?.rang_c?.total ?? 0,
      'Missions D remplies': api.stats_ninja?.missions?.rang_d?.remplie ?? 0,
      'Total missions D': api.stats_ninja?.missions?.rang_d?.total ?? 0,
      'Missions E remplies': api.stats_ninja?.missions?.rang_e?.remplie ?? 0,
      'Total missions E': api.stats_ninja?.missions?.rang_e?.total ?? 0,
    },
    jutsu: api.jutsu ?? [],
    ninjaExperience: [], // à compléter si tu as l'info
    rewardsToApply: [],
    newExperienceDate: '',
    newExperienceDescription: '',
  });

  // Affichage du chargement ou des erreurs
  if (loading || loadingCharacter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-xl font-bold flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Chargement des personnages...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-red-700 text-white p-4">
        <div className="bg-red-800 p-6 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-white text-red-800 rounded-md font-semibold hover:bg-gray-200 transition duration-300"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // bg-gray-800/70

  return (
    <div className="bg-dark-bg backdrop-blur-sm text-white font-inter pt-24 pb-12">
      {/* Notifications */}
      <AnimatePresence>
        {messageBox.show && (
          <MessageBox
            message={messageBox.message}
            type={messageBox.type}
            onClose={() => setMessageBox({ ...messageBox, show: false })}
          />
        )}
      </AnimatePresence>

      {/* Affichage des détails du personnage sélectionné */}
      {selectedCharacter ? (
        <div className="container mx-auto px-4 py-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToList}
            className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </motion.button>
          <CharacterDetail
            character={selectedCharacter}
            onUpdate={handleUpdateCharacter}
            onShare={handleShareCharacter}
            loading={loading || loadingCharacter}
            setMessageBox={setMessageBox}
            calculateChakra={calculateChakra}
          />
        </div>
      ) : (
        // Affichage de la liste des personnages
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-blue-300 mb-2">
              Personnages de {rolistId}
            </h1>
            <p className="text-gray-400 text-lg">
              Sélectionnez un personnage pour voir ses détails
            </p>
          </motion.div>

          {/* Affichage des cartes de personnages */}
          {characters.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {characters.map((character) => (
                <CharacterCard
                  key={character.avatarName}
                  character={character}
                  onSelect={() => handleSelectCharacter(character)}
                />
              ))}
            </motion.div>
          ) : (
            // Message si aucun personnage n'est trouvé
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-xl">
                Aucun personnage trouvé pour ce rôliste.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}