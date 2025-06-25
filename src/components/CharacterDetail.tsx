// Importation des dépendances nécessaires
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

// Importation des fonctions de formatage
import { capitalizeFirstLetter } from '@/middlewares/formatfunctions';

// Listes d'options pour les champs de sélection
const GRADES = ['Aspirant Ninja', 'Genin', 'Chunin', 'AMBU', 'Capitaine AMBU', 'Chef de Section', 'Jonin', 'Chef de clan', 'Hokage', 'Mizukage', 'Kazekage', 'Raikage', 'Tsuchikage'];
const CHAKRA_NATURES_OPTIONS = ['Eau (Suiton 🌊)', 'Air (Futon🌪)', 'Feu (Katon🔥)', 'Terre (Doton⛰)', 'Foudre (Raiton⚡)', 'Yin (Inton🌙)', 'Yang (Yoton🌕)', 'Yin-Yang (Inyôton☯)'];
const SPECIALIZATIONS = ['Aucune', 'Ninja sensoriel', 'Ninja spatio-temporel', 'Ninja médecin'];
const VILLAGES = ['Konoha', 'Kiri', 'Suna', 'Kumo', 'Iwa', 'Ame', 'Taki', 'Oto', 'Uzushio'];

// Types pour les props et le personnage
type NinjaSkill = {
  current: number;
  max: number;
};

type NinjaSkills = {
  agility: NinjaSkill;
  speed: NinjaSkill;
  precision: NinjaSkill;
  reactivity: NinjaSkill;
  endurance: NinjaSkill;
  bruteForce: NinjaSkill;
  psychicGrip: NinjaSkill;
  sensoryCapacities: NinjaSkill;
};

type Reward = {
  type: string;
  name?: string;
  value?: any;
};

type Jutsu = {
  name: string;
  rank: string;
  custom?: boolean;
};

type Palmares = {
  [key: string]: number | string;
};

// Nouveau type pour l'équipement avec quantité
type Equipment = {
  name: string;
  quantity: number;
};

// Nouveau type pour l'expérience ninja avec date modifiable
type EditableNinjaExperience = {
  date: string;
  description: string;
  isEditing?: boolean;
};

// Type pour la réponse de l'API
type ApiAvatar = {
  _id: string;
  num_sng: number;
  actif: boolean;
  mort: boolean;
  clan: string;
  name: string;
  pays: string;
  village: string;
  lien: string;
  age: number;
  taille: number;
  grade: string;
  roliste: string;
  utilisateur: number;
  integration: string;
  affinite: string[];
  statut: string;
  capacite: {
    hereditaire: string[];
    speciale: string;
  };
  competences: {
    vitesse: {
      total: number;
      deplacement: number;
      mouvement: number;
      lancer: number;
    };
    precision: number;
    reactivite: number;
    endurance: number;
    force_brute: number;
    etreinte: number;
    maitrise_chakra: number;
    sensorielles: number;
    chakra: number;
  };
  jutsu: any[];
  equipements: Array<{
    name: string;
    nb: number;
    plus: boolean;
  }>;
  equipement_principal: string;
  stats_ninja: {
    combats: {
      gagne: number;
      tout: number;
    };
    tournois: {
      gagnes: number;
      tout: number;
    };
    missions: {
      rang_s: { remplie: number; total: number };
      rang_a: { remplie: number; total: number };
      rang_b: { remplie: number; total: number };
      rang_c: { remplie: number; total: number };
      rang_d: { remplie: number; total: number };
      rang_e: { remplie: number; total: number };
    };
  };
  image: {
    principale: string;
    toutes: string[];
  };
};

// Types pour les jutsu de l'API
interface ApiJutsu {
  _id: string;
  name: {
    vostfr: string;
    vf: string;
    vo: string;
  };
  rang: string;
  classification: string;
  affinite: string;
  portee: any;
  references: any[];
  description: any;
  utilisation: any;
}

type Character = {
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
  health: number;
  strength: number;
  speed: number;
  intelligence: number;
  ninjaSkills: NinjaSkills;
  rewardsToApply: Reward[];
  ninjaEquipment: Equipment[];
  palmares: Palmares;
  jutsu: Jutsu[];
  ninjaExperience: EditableNinjaExperience[];
  // Nouveaux champs pour l'édition
  newExperienceDate: string;
  newExperienceDescription: string;
};

interface CharacterDetailProps {
  character: Character;
  onUpdate: (character: Character) => void;
  onShare: (character: Character) => void;
  loading: boolean;
  setMessageBox: (msg: { show: boolean; message: string; type: 'success' | 'error' }) => void;
  calculateChakra: (endurance: number) => number;
}

// Modal de code secret
function SecretCodeModal({ open, onClose, onValidate, label }: { open: boolean; onClose: () => void; onValidate: (code: string) => void; label: string }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{4}$/.test(code)) {
      setError('Le code doit comporter 4 chiffres.');
      return;
    }
    setError('');
    onValidate(code);
  };

  useEffect(() => {
    if (!open) setCode('');
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-xs">
        <h2 className="text-xl font-bold text-blue-300 mb-4 text-center">{label}</h2>
        <input
          type="password"
          maxLength={4}
          pattern="[0-9]{4}"
          value={code}
          onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          placeholder="0000"
          autoFocus
        />
        {error && <div className="text-red-400 text-sm mb-2 text-center">{error}</div>}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded">Annuler</button>
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">Valider</button>
        </div>
      </form>
    </div>
  );
}

// Composant pour afficher les détails et permettre l'édition d'un personnage
export default function CharacterDetail({
  character,
  onUpdate,
  onShare,
  loading,
  setMessageBox,
  calculateChakra,
}: CharacterDetailProps) {  
  const [editableCharacter, setEditableCharacter] = useState<Character>(character);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [apiData, setApiData] = useState<ApiAvatar | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [jutsuList, setJutsuList] = useState<ApiJutsu[]>([]);
  const [jutsuSearch, setJutsuSearch] = useState('');
  const [jutsuLoading, setJutsuLoading] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState<'save' | 'reward' | null>(null);
  const [secretError, setSecretError] = useState('');
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [newReward, setNewReward] = useState<{ type: string; name?: string; value?: any }>({ type: 'stat', name: '', value: 0 });

  // Met à jour l'état interne si le personnage sélectionné change
  useEffect(() => {
    setEditableCharacter(character);
    // Appel API pour récupérer les données du personnage
    if (character.avatarName) {
      fetchCharacterData(character.avatarName);
    }
    // Appel API pour récupérer la liste des jutsu
    fetchJutsuList();
  }, [character]);

  // Fonction pour récupérer les données depuis l'API
  const fetchCharacterData = async (avatarName: string) => {
    if (!avatarName) return;
    
    setIsLoadingApi(true);
    try {
      const response = await fetch(`https://datarikbook-api.vercel.app/sng/liste/avatars/actif/${avatarName}`);
      const data = await response.json();
      
      if (data.ok && data.avatar) {
        setApiData(data.avatar);
        // Mettre à jour le personnage avec les données de l'API
        updateCharacterWithApiData(data.avatar);
      } else {
        setMessageBox({ show: true, message: 'Erreur lors de la récupération des données du personnage', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur API:', error);
      setMessageBox({ show: true, message: 'Erreur de connexion à l\'API', type: 'error' });
    } finally {
      setIsLoadingApi(false);
    }
  };

  // Fonction pour mettre à jour le personnage avec les données de l'API
  const updateCharacterWithApiData = (apiAvatar: ApiAvatar) => {
    setEditableCharacter(prev => ({
      ...prev,
      avatarName: apiAvatar.name,
      clanFamily: apiAvatar.clan,
      originCountry: apiAvatar.pays,
      currentVillage: apiAvatar.village,
      kinship: apiAvatar.lien,
      age: apiAvatar.age,
      height: apiAvatar.taille,
      grade: apiAvatar.grade,
      rolist: apiAvatar.roliste,
      userTag: apiAvatar.utilisateur.toString(),
      chakraNatures: apiAvatar.affinite,
      specialCapacity: apiAvatar.capacite.speciale,
      hereditaryCapacity: apiAvatar.capacite.hereditaire,
      // Conversion des compétences - seulement si elles n'existent pas déjà
      ninjaSkills: prev.ninjaSkills || {
        agility: { current: apiAvatar.competences.vitesse.total, max: apiAvatar.competences.vitesse.total },
        speed: { current: apiAvatar.competences.vitesse.total, max: apiAvatar.competences.vitesse.total },
        precision: { current: apiAvatar.competences.precision, max: apiAvatar.competences.precision },
        reactivity: { current: apiAvatar.competences.reactivite, max: apiAvatar.competences.reactivite },
        endurance: { current: apiAvatar.competences.endurance, max: apiAvatar.competences.endurance },
        bruteForce: { current: apiAvatar.competences.force_brute, max: apiAvatar.competences.force_brute },
        psychicGrip: { current: apiAvatar.competences.etreinte, max: apiAvatar.competences.etreinte },
        sensoryCapacities: { current: apiAvatar.competences.sensorielles, max: apiAvatar.competences.sensorielles },
      },
      // Conversion des équipements - seulement si la liste est vide
      ninjaEquipment: prev.ninjaEquipment.length === 0 ? apiAvatar.equipements.map(eq => ({
        name: eq.name,
        quantity: eq.nb
      })) : prev.ninjaEquipment,
      // Conversion du palmarès - seulement si vide
      palmares: {
        'Combats gagnés': apiAvatar.stats_ninja.combats.gagne,
        'Total combats': apiAvatar.stats_ninja.combats.tout,
        'Tournois gagnés': apiAvatar.stats_ninja.tournois.gagnes,
        'Total tournois': apiAvatar.stats_ninja.tournois.tout,
        'Battle royale gagnés': apiAvatar.stats_ninja.missions.rang_s.remplie,
        'Total battle royale': apiAvatar.stats_ninja.missions.rang_s.total,
        'Réponses quiz SNG': apiAvatar.stats_ninja.missions.rang_e.remplie,
        'Total quiz SNG': apiAvatar.stats_ninja.missions.rang_e.total,
      },
      // Garder les champs existants
      newExperienceDate: prev.newExperienceDate || '',
      newExperienceDescription: prev.newExperienceDescription || '',
    }));
  };

  // Appel API pour récupérer la liste des jutsu
  const fetchJutsuList = async () => {
    setJutsuLoading(true);
    try {
      const response = await fetch('https://datarikbook-api.vercel.app/sng/liste/jutsu');
      const data = await response.json();
      if (data.ok && data.liste) {
        setJutsuList(data.liste);
      }
    } catch (e) {
      setMessageBox({ show: true, message: 'Erreur lors de la récupération des jutsu', type: 'error' });
    } finally {
      setJutsuLoading(false);
    }
  };

  // Fonction pour ajouter une nouvelle expérience ninja
  const addNinjaExperience = () => {
    if (!editableCharacter.newExperienceDate || !editableCharacter.newExperienceDescription) {
      setMessageBox({ show: true, message: 'Veuillez remplir tous les champs pour l\'expérience', type: 'error' });
      return;
    }

    setEditableCharacter(prev => ({
      ...prev,
      ninjaExperience: [
        ...prev.ninjaExperience,
        {
          date: prev.newExperienceDate,
          description: prev.newExperienceDescription,
        }
      ],
      newExperienceDate: '',
      newExperienceDescription: '',
    }));

    setMessageBox({ show: true, message: 'Expérience ninja ajoutée !', type: 'success' });
  };

  // Fonction pour supprimer une expérience ninja
  const removeNinjaExperience = (index: number) => {
    setEditableCharacter(prev => ({
      ...prev,
      ninjaExperience: prev.ninjaExperience.filter((_, i) => i !== index),
    }));
  };

  // Fonction pour modifier une valeur du palmarès
  const updatePalmaresValue = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditableCharacter(prev => ({
      ...prev,
      palmares: {
        ...prev.palmares,
        [key]: numValue,
      },
    }));
  };

  // Fonction pour ajouter un nouvel équipement
  const addEquipment = () => {
    const newEquipmentName = prompt('Nom de l\'équipement:');
    const newEquipmentQuantity = prompt('Quantité:');
    
    if (newEquipmentName && newEquipmentQuantity) {
      const quantity = parseInt(newEquipmentQuantity) || 1;
      setEditableCharacter(prev => ({
        ...prev,
        ninjaEquipment: [
          ...prev.ninjaEquipment,
          { name: newEquipmentName, quantity }
        ],
      }));
    }
  };

  // Fonction pour supprimer un équipement
  const removeEquipment = (index: number) => {
    setEditableCharacter(prev => ({
      ...prev,
      ninjaEquipment: prev.ninjaEquipment.filter((_, i) => i !== index),
    }));
  };

  // Détermine si un champ est éditable en fonction des récompenses à appliquer
  const isFieldEditableAsReward = (fieldName: string) => {
    // Ninja skills are always editable via +/- buttons, not directly via input fields.
    // The conditional for skill buttons handles this.
    // This function is for other fields (selects, direct number inputs).

    return editableCharacter.rewardsToApply.some(reward => {
      if (reward.type === 'stat' && reward.name === fieldName) return true;
      if (reward.type === fieldName) return true; // For grade, affinity, specialization, currentVillage
      return false;
    });
  };

  // Gère les changements dans les champs de saisie génériques (non-select)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableCharacter(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'level' || name === 'health' || name === 'strength' || name === 'speed' || name === 'intelligence'
        ? (parseFloat(value) || 0)
        : value,
    }));
  };

  // Gère les changements pour les sélections (grade, specialization, currentVillage)
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableCharacter(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gère les changements pour la sélection multiple (chakraNatures)
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setEditableCharacter(prev => ({
      ...prev,
      chakraNatures: selectedValues,
    }));
  };

  // Gère les changements pour les checkboxes des natures de chakra
  const handleChakraNatureCheckbox = (nature: string) => {
    setEditableCharacter(prev => ({
      ...prev,
      chakraNatures: prev.chakraNatures.includes(nature)
        ? prev.chakraNatures.filter(n => n !== nature)
        : [...prev.chakraNatures, nature],
    }));
  };

  // Gère l'augmentation/diminution des compétences ninja
  const adjustNinjaSkill = (skillName: keyof NinjaSkills, amount: number) => {
    const currentPcn = editableCharacter.rewardsToApply.find(r => r.type === 'ninjaSkillPoints')?.value || 0;
    const currentSkill = editableCharacter.ninjaSkills[skillName].current;
    const maxSkill = editableCharacter.ninjaSkills[skillName].max;

    let allowUpdate = true;
    let message = '';
    let messageType: 'success' | 'error' = 'error';

    if (amount > 0) { // Augmenter
      if (currentPcn <= 0) {
        message = 'Points de Compétences Ninja (PCN) insuffisants !';
        messageType = 'error';
        allowUpdate = false;
      } else if (currentSkill >= maxSkill) {
        message = `La compétence ${skillLabels[skillName]} a déjà atteint son maximum (${maxSkill}).`;
        messageType = 'error';
        allowUpdate = false;
      }
    } else { // Diminuer
      if (currentSkill <= 0) {
        message = `La compétence ${skillLabels[skillName]} ne peut pas être inférieure à 0.`;
        messageType = 'error';
        allowUpdate = false;
      }
    }

    if (!allowUpdate) {
      setMessageBox({ show: true, message: message, type: messageType });
      return;
    }

    // If no error, proceed with state update
    setEditableCharacter(prev => {
      let newSkillValue = prev.ninjaSkills[skillName].current + amount;
      let newPcn = (prev.rewardsToApply.find(r => r.type === 'ninjaSkillPoints')?.value || 0) + (amount > 0 ? -1 : 1);

      const updatedRewardsToApply = prev.rewardsToApply.map(reward =>
        reward.type === 'ninjaSkillPoints' ? { ...reward, value: newPcn } : reward
      );

      return {
        ...prev,
        ninjaSkills: {
          ...prev.ninjaSkills,
          [skillName]: {
            ...prev.ninjaSkills[skillName],
            current: newSkillValue,
          },
        },
        rewardsToApply: updatedRewardsToApply,
      };
    });
  };

  // Applique les récompenses générales aux statistiques et autres attributs
  const handleApplyRewards = () => {
    let updatedChar = { ...editableCharacter };
    let remainingRewards: Reward[] = [];

    editableCharacter.rewardsToApply.forEach(reward => {
      if (reward.type === 'stat') {
        // Only allow keys that exist on Character and are number type
        type CharacterNumberKeys = {
          [K in keyof Character]: Character[K] extends number ? K : never
        }[keyof Character];
        const key = reward.name as CharacterNumberKeys;
        if (key && typeof updatedChar[key] === 'number') {
          updatedChar = {
            ...updatedChar,
            [key]: (updatedChar[key] as number) + reward.value,
          };
        }
      } else if (reward.type === 'grade') {
        updatedChar.grade = reward.value;
      } else if (reward.type === 'affinity') {
        // Add new affinity if not already present
        if (!updatedChar.chakraNatures.includes(reward.value)) {
          updatedChar.chakraNatures = [...updatedChar.chakraNatures, reward.value];
        }
      } else if (reward.type === 'ninjaSkillPoints') {
        // PCN are applied incrementally, keep them if not fully spent
        if (reward.value > 0) {
            remainingRewards.push(reward);
        }
      } else {
        remainingRewards.push(reward); // Keep other unhandled rewards
      }
    });

    setEditableCharacter(prev => ({
      ...updatedChar, // Use the updatedChar object after applying rewards
      rewardsToApply: remainingRewards, // Update rewardsToApply to only include remaining ones
    }));

    setMessageBox({ show: true, message: 'Récompenses appliquées ! N\'oubliez pas de sauvegarder.', type: 'success' });
  };

  // Gère la soumission du formulaire de mise à jour
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(editableCharacter);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000); // Cache le message après 3 secondes
  };

  const skillLabels = {
    agility: 'Agilité', speed: 'Vitesse', precision: 'Précision', reactivity: 'Réactivité',
    endurance: 'Endurance', bruteForce: 'Force brute', psychicGrip: 'Étreinte Psychique',
    sensoryCapacities: 'Capacités sensorielles',
  };

  // Handler pour ajouter un jutsu à la fiche
  const handleAddJutsu = (jutsu: ApiJutsu) => {
    setEditableCharacter(prev => ({
      ...prev,
      jutsu: [
        ...prev.jutsu,
        {
          name: capitalizeFirstLetter(jutsu.name.vostfr),
          rank: jutsu.rang.toUpperCase(),
          custom: false,
        },
      ],
    }));
    setJutsuSearch('');
  };

  // Handler pour valider le code secret pour la sauvegarde
  const handleSecretSave = (code: string) => {
    if (code === '4024') {
      setShowSecretModal(null);
      setSecretError('');
      onUpdate(editableCharacter);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } else {
      setSecretError('Code incorrect. Vous n\'avez pas le droit à cette fonctionnalité.');
    }
  };

  // Handler pour valider le code secret pour l'ajout de récompense
  const handleSecretReward = (code: string) => {
    if (code === '1832') {
      setShowSecretModal(null);
      setSecretError('');
      setShowRewardForm(true);
    } else {
      setSecretError('Code incorrect. Vous n\'avez pas le droit à cette fonctionnalité.');
    }
  };

  // Handler pour ajouter une récompense
  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    setEditableCharacter(prev => ({
      ...prev,
      rewardsToApply: [...prev.rewardsToApply, newReward],
    }));
    setShowRewardForm(false);
    setNewReward({ type: 'stat', name: '', value: 0 });
    setMessageBox({ show: true, message: 'Récompense ajoutée !', type: 'success' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <img
          src={editableCharacter.image}
          alt={editableCharacter.avatarName}
          className="w-40 h-40 rounded-full object-cover mb-6 md:mb-0 md:mr-8 border-4 border-blue-500 shadow-lg"
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/150x150/555555/ffffff?text=Image';
          }} // Fallback image
        />
        <div>
          <h2 className="text-4xl font-extrabold text-blue-300 mb-2">{capitalizeFirstLetter(editableCharacter.avatarName)}</h2>
          <p className="text-gray-400 text-xl">Village: <span className="font-semibold text-white">{capitalizeFirstLetter(editableCharacter.currentVillage)}</span></p>
          <p className="text-gray-400 text-xl">Grade: <span className="font-semibold text-white">{capitalizeFirstLetter(editableCharacter.grade)}</span></p>
          <p className="text-gray-400 text-md">Rôliste: <span className="font-semibold text-white">{editableCharacter.rolist}</span></p>
          <p className="text-gray-400 text-md">User: <span className="font-semibold text-white">{editableCharacter.userTag}</span></p>
          {isLoadingApi && (
            <div className="flex items-center mt-2">
              <svg className="animate-spin h-4 w-4 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-blue-400 text-sm">Synchronisation avec l&apos;API...</span>
            </div>
          )}
          {!isLoadingApi && apiData && (
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-sm mr-2">✓ Données synchronisées</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => fetchCharacterData(editableCharacter.avatarName)}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Rafraîchir
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour le code secret sauvegarde */}
      <SecretCodeModal
        open={showSecretModal === 'save'}
        onClose={() => { setShowSecretModal(null); setSecretError(''); }}
        onValidate={handleSecretSave}
        label="Entrer le code secret pour sauvegarder"
      />
      {/* Modal pour le code secret récompense */}
      <SecretCodeModal
        open={showSecretModal === 'reward'}
        onClose={() => { setShowSecretModal(null); setSecretError(''); }}
        onValidate={handleSecretReward}
        label="Entrer le code secret pour ajouter une récompense"
      />

      <form onSubmit={e => { e.preventDefault(); setShowSecretModal('save'); }}>
        {/* Section Récompenses Générales */}
        <div className="mb-6 bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Récompenses Générales à Appliquer</h3>
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowSecretModal('reward')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
            >
              + Ajouter une récompense
            </motion.button>
          </div>
          {editableCharacter.rewardsToApply.filter(r => r.type !== 'ninjaSkillPoints').length > 0 ? (
            <>
              {editableCharacter.rewardsToApply.filter(r => r.type !== 'ninjaSkillPoints').map((reward, index) => (
                <p key={index} className="text-gray-300 mb-2 text-lg">
                  {reward.type === 'stat' && reward.name
                    ? `${reward.name.charAt(0).toUpperCase() + reward.name.slice(1)}: +${reward.value}`
                    : reward.type === 'grade'
                    ? `Nouveau grade: ${reward.value}`
                    : reward.type === 'affinity'
                    ? `Nouvelle affinité: ${reward.value}`
                    : `Type de récompense inconnu: ${reward.type}`}
                </p>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleApplyRewards}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              >
                Appliquer les Récompenses Générales
              </motion.button>
            </>
          ) : (
            <p className="text-gray-400 italic">Aucune récompense générale en attente.</p>
          )}
        </div>
        
        {/* Formulaire d'ajout de récompense */}
        {showRewardForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <form onSubmit={handleAddReward} className="bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
              <h2 className="text-xl font-bold text-yellow-300 mb-4 text-center">Ajouter une récompense</h2>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Type</label>
                <select
                  value={newReward.type}
                  onChange={e => setNewReward({ ...newReward, type: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="stat">Statistique</option>
                  <option value="grade">Grade</option>
                  <option value="affinity">Affinité</option>
                  <option value="ninjaSkillPoints">PCN</option>
                </select>
              </div>
              {newReward.type === 'stat' && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Nom de la statistique</label>
                  <input
                    type="text"
                    value={newReward.name || ''}
                    onChange={e => setNewReward({ ...newReward, name: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Valeur</label>
                <input
                  type="number"
                  value={newReward.value || ''}
                  onChange={e => setNewReward({ ...newReward, value: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setShowRewardForm(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded">Annuler</button>
                <button type="submit" className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 rounded">Ajouter</button>
              </div>
            </form>
          </div>
        )}
        {/* Message d'erreur code secret */}
        {secretError && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50 text-center font-bold">
            {secretError}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Section Informations de Base */}
          <div className="bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Informations de Base</h3>
            <div className="mb-4">
              <label htmlFor="clanFamily" className="block text-gray-300 text-sm font-bold mb-2">
                Clan/Famille:
              </label>
              <input type="text" id="clanFamily" name="clanFamily" value={editableCharacter.clanFamily} onChange={handleChange} disabled={true}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400" />
            </div>
            <div className="mb-4">
              <label htmlFor="originCountry" className="block text-gray-300 text-sm font-bold mb-2">
                Pays d'origine:
              </label>
              <input type="text" id="originCountry" name="originCountry" value={editableCharacter.originCountry} onChange={handleChange} disabled={true}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400" />
            </div>
            <div className="mb-4">
              <label htmlFor="currentVillage" className="block text-gray-300 text-sm font-bold mb-2">
                Village actuel:
              </label>
              <select id="currentVillage" name="currentVillage" value={editableCharacter.currentVillage} onChange={handleSelectChange} disabled={!isFieldEditableAsReward('currentVillage')}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400">
                {VILLAGES.map(village => (
                  <option key={village} value={village}>{village}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="kinship" className="block text-gray-300 text-sm font-bold mb-2">
                Lien de parenté:
              </label>
              <input type="text" id="kinship" name="kinship" value={editableCharacter.kinship} onChange={handleChange} disabled={true}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400" />
            </div>
            <div className="mb-4">
              <label htmlFor="age" className="block text-gray-300 text-sm font-bold mb-2">
                Âge:
              </label>
              <input type="number" id="age" name="age" value={editableCharacter.age} onChange={handleChange} disabled={true}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400" />
            </div>
            <div className="mb-4">
              <label htmlFor="height" className="block text-gray-300 text-sm font-bold mb-2">
                Taille (m):
              </label>
              <input type="number" step="0.01" id="height" name="height" value={editableCharacter.height} onChange={handleChange} disabled={true}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400" />
            </div>
            <div className="mb-4">
              <label htmlFor="grade" className="block text-gray-300 text-sm font-bold mb-2">
                Grade:
              </label>
              <select id="grade" name="grade" value={editableCharacter.grade} onChange={handleSelectChange} disabled={!isFieldEditableAsReward('grade')}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400">
                {GRADES.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section Natures de Chakra & Capacités Spéciales */}
          <div className="bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Chakra & Capacités</h3>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Natures de Chakra:
              </label>
              <div className="flex flex-wrap gap-2">
                {CHAKRA_NATURES_OPTIONS.map(nature => (
                  <label key={nature} className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border transition-all duration-200
                    ${editableCharacter.chakraNatures.includes(nature) ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-300'}
                    ${!isFieldEditableAsReward('affinity') ? 'opacity-50 cursor-not-allowed' : ''}
                  `}>
                    <input
                      type="checkbox"
                      value={nature}
                      checked={editableCharacter.chakraNatures.includes(nature)}
                      onChange={() => handleChakraNatureCheckbox(nature)}
                      disabled={!isFieldEditableAsReward('affinity')}
                      className="form-checkbox h-5 w-5 text-blue-500 mr-2 accent-blue-500"
                    />
                    <span>{nature}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="specialCapacity" className="block text-gray-300 text-sm font-bold mb-2">
                Cap. spéciale:
              </label>
              <input type="text" id="specialCapacity" name="specialCapacity" value={editableCharacter.specialCapacity} onChange={handleChange} disabled={true}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400" />
            </div>
            <div className="mb-4">
              <label htmlFor="specialization" className="block text-gray-300 text-sm font-bold mb-2">
                Spécialisation:
              </label>
              <select id="specialization" name="specialization" value={editableCharacter.specialization} onChange={handleSelectChange} disabled={!isFieldEditableAsReward('specialization')}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400">
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="hereditaryCapacity" className="block text-gray-300 text-sm font-bold mb-2">
                Cap. Héréditaire(s) (séparées par des virgules):
              </label>
              <input type="text" id="hereditaryCapacity" name="hereditaryCapacity"
                value={editableCharacter.hereditaryCapacity.join(', ')}
                onChange={(e) => setEditableCharacter(prev => ({ ...prev, hereditaryCapacity: e.target.value.split(',').map(s => s.trim()) }))}
                disabled={true}
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Section Stats Générales */}
        <div className="mb-6 bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Statistiques Générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries({
              health: 'Points de Vie',
              strength: 'Force',
              speed: 'Vitesse',
              intelligence: 'Intelligence',
            }).map(([key, label]) => (
              <div key={key} className="mb-2">
                <label htmlFor={key} className="block text-gray-300 text-sm font-bold mb-1">
                  {label}:
                </label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  value={editableCharacter[key as keyof Character] as number | string}
                  onChange={handleChange}
                  disabled={!isFieldEditableAsReward(key)}
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section Compétences Ninja */}
        <div className="mb-6 bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
          <h3 className="text-2xl font-bold text-green-400 mb-4">
            Compétences Ninja
            <span className="ml-4 text-xl text-yellow-300">
              PCN disponibles: {editableCharacter.rewardsToApply.find(r => r.type === 'ninjaSkillPoints')?.value || 0}
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editableCharacter.ninjaSkills).map(([key, skill]) => (
              <div key={key} className="flex items-center justify-between flex-wrap bg-gray-700 p-3 rounded-md shadow-sm">
                <span className="text-gray-300 font-semibold">{skillLabels[key as keyof typeof skillLabels]}:</span>
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={() => adjustNinjaSkill(key as keyof NinjaSkills, -1)}
                    disabled={skill.current <= 0}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-lg px-4 cursor-pointer font-bold transition duration-200"
                  >
                    -
                  </motion.button>
                  <span className="text-lg font-bold text-white w-16 text-center">
                    {skill.current}/{skill.max}
                  </span>
                  <motion.button
                    type="button"
                    onClick={() => adjustNinjaSkill(key as keyof NinjaSkills, 1)}
                    disabled={skill.current >= skill.max || (editableCharacter.rewardsToApply.find(r => r.type === 'ninjaSkillPoints')?.value || 0) <= 0}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-lg px-4 cursor-pointer font-bold transition duration-200"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
          <p className="col-span-full text-lg text-gray-300 mt-4">
            Unités de Chakra (UC) en fonction de l'Endurance: <span className="font-bold text-yellow-300">{calculateChakra(editableCharacter.ninjaSkills.endurance.current)} UC</span>
          </p>
        </div>

        {/* Section Équipements Ninja */}
        <div className="mb-6 bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Équipements Ninja</h3>
          <div className="mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addEquipment}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            >
              + Ajouter un équipement
            </motion.button>
          </div>
          {editableCharacter.ninjaEquipment.length > 0 ? (
            <div className="space-y-2">
              {editableCharacter.ninjaEquipment.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                  <span className="text-gray-300 font-semibold">
                    {item.name} <span className="text-yellow-300">x{item.quantity}</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => removeEquipment(index)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                  >
                    Supprimer
                  </motion.button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">Aucun équipement enregistré.</p>
          )}
        </div>

        {/* Section Palmarès */}
        <div className="mb-6 bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Palmarès</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(editableCharacter.palmares).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                <label className="text-gray-300 font-semibold text-sm">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                </label>
                <input
                  type="number"
                  value={value as number}
                  onChange={(e) => updatePalmaresValue(key, e.target.value)}
                  className="w-20 text-center bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section Jutsu */}
        <div className="mb-6 bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Jutsu Maîtrisés
            <span className="ml-4 text-xl text-blue-300">
              【{editableCharacter.jutsu.length}】
            </span>
          </h3>

          {/* Champ de recherche et ajout de jutsu */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">Ajouter un jutsu</label>
            <input
              type="text"
              placeholder="Rechercher un jutsu (nom vostfr)"
              value={jutsuSearch}
              onChange={e => setJutsuSearch(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              disabled={jutsuLoading}
            />
            {jutsuSearch && (
              <div className="bg-gray-900 border border-gray-700 rounded shadow-lg max-h-48 overflow-y-auto z-10 relative">
                {jutsuList
                  .filter(jutsu => {
                    const aff = jutsu.affinite?.toLowerCase() || 'aucune';
                    return (
                      (aff === 'aucune' || editableCharacter.chakraNatures.map(n => n.toLowerCase()).includes(aff)) &&
                      jutsu.name.vostfr.toLowerCase().includes(jutsuSearch.toLowerCase()) &&
                      !editableCharacter.jutsu.some(j => j.name.toLowerCase() === jutsu.name.vostfr.toLowerCase())
                    );
                  })
                  .slice(0, 8)
                  .map(jutsu => (
                    <button
                      key={jutsu._id}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-blue-700 text-white border-b border-gray-700 last:border-b-0"
                      onClick={() => handleAddJutsu(jutsu)}
                    >
                      {capitalizeFirstLetter(jutsu.name.vostfr)} <span className="text-yellow-400">[{jutsu.rang.toUpperCase()}]</span>
                      {jutsu.affinite && jutsu.affinite !== 'aucune' && (
                        <span className="ml-2 text-blue-300">({capitalizeFirstLetter(jutsu.affinite)})</span>
                      )}
                    </button>
                  ))}
                {jutsuList.filter(jutsu => {
                  const aff = jutsu.affinite?.toLowerCase() || 'aucune';
                  return (
                    (aff === 'aucune' || editableCharacter.chakraNatures.map(n => n.toLowerCase()).includes(aff)) &&
                    jutsu.name.vostfr.toLowerCase().includes(jutsuSearch.toLowerCase()) &&
                    !editableCharacter.jutsu.some(j => j.name.toLowerCase() === jutsu.name.vostfr.toLowerCase())
                  );
                }).length === 0 && (
                  <div className="px-4 py-2 text-gray-400">Aucun jutsu trouvé</div>
                )}
              </div>
            )}
          </div>

          <ul className="list-disc pl-5 text-gray-300">
            {editableCharacter.jutsu.map((jutsu, index) => (
              <li key={index} className="mb-1">
                【{jutsu.rank}】: {jutsu.name} {jutsu.custom && '(Jutsu créé)'}
              </li>
            ))}
          </ul>
        </div>

        {/* Section Expérience Ninja */}
        <div className="mb-6 bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Expérience Ninja</h3>
          
          {/* Formulaire pour ajouter une nouvelle expérience */}
          <div className="mb-6 bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-blue-300 mb-3">Ajouter une nouvelle expérience</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="newExperienceDate" className="block text-gray-300 text-sm font-bold mb-2">
                  Date:
                </label>
                <input
                  type="date"
                  id="newExperienceDate"
                  value={editableCharacter.newExperienceDate}
                  onChange={(e) => setEditableCharacter(prev => ({ ...prev, newExperienceDate: e.target.value }))}
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="newExperienceDescription" className="block text-gray-300 text-sm font-bold mb-2">
                  Description:
                </label>
                <input
                  type="text"
                  id="newExperienceDescription"
                  value={editableCharacter.newExperienceDescription}
                  onChange={(e) => setEditableCharacter(prev => ({ ...prev, newExperienceDescription: e.target.value }))}
                  placeholder="Description de l'expérience..."
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-600 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addNinjaExperience}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Ajouter l'expérience
            </motion.button>
          </div>

          {/* Liste des expériences existantes */}
          <div>
            <h4 className="text-lg font-bold text-green-300 mb-3">Expériences enregistrées</h4>
            {editableCharacter.ninjaExperience.length > 0 ? (
              <div className="space-y-2">
                {editableCharacter.ninjaExperience.map((exp, index) => (
                  <div key={index} className="flex items-center justify-between flex-wrap bg-gray-700 p-3 rounded-md">
                    <div className="flex-1">
                      <span className="text-yellow-300 font-semibold">{exp.date}:</span>
                      <span className="text-gray-300 ml-2">{exp.description}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => removeNinjaExperience(index)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ml-2"
                    >
                      Supprimer
                    </motion.button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">Aucune expérience enregistrée.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading} // Désactive le bouton pendant le chargement
            className={`flex-1 ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sauvegarder les Modifications'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onShare(editableCharacter)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          >
            Partager sur WhatsApp
          </motion.button>
        </div>

        {showSaveSuccess && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center text-green-400 mt-4 font-semibold"
          >
            Fiche sauvegardée avec succès !
          </motion.p>
        )}
      </form>
    </motion.div>
  );
}