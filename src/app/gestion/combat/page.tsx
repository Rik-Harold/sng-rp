'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Save, X, Users, Calendar, Clock, Sword, 
  MinusCircle, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';

// ==================== TYPES ====================

type Arbitre = {
  presence: boolean;
  idArbitre: string;
  nom: string;
  pseudo: string;
};

type Combattant = {
  solo: boolean;
  roliste: string;
  rolisteRemplacement: boolean;
  rolisteRemplace: string;
  clan: string;
  nom: string;
  image: string;
  idPersonnage: string;
  clan2: string;
  nom2: string;
  image2: string;
  idPersonnage2: string;
  vainqueur: boolean;
  perdant: boolean;
  nul: boolean;
};

type Contexte = {
  description: string;
  latence: {
    presence: boolean;
    delai: number;
    typeLatence: 'min' | 'h' | 'j';
  };
};

type Situation = {
  fin: boolean;
  dateDebut: string;
  dateFin: string;
};

type Verdict = {
  auteur: string;
  fin: boolean;
  pause: boolean;
  poursuite: boolean;
  date?: string;
  heure?: string;
  texte: string;
  image: string;
  revendications: Array<{
    roliste: string;
    arbitre: boolean;
    combattant: string;
    texte: string;
  }>;
};

type Contre = {
  date: string;
  heure: string;
  combattant: string;
  reactions: {
    like: number;
    dislike: number;
    surpris: number;
    triste: number;
    drole: number;
  };
  image: string;
  texte: string;
  actionCaches: {
    presence: boolean;
    listeTechniques: Array<{
      name: string;
      lien: string;
      debut: boolean;
      enCours: boolean;
      fin: boolean;
    }>;
    texte: string;
  };
};

type Tour = {
  tour: number;
  arbitre: boolean;
  auteur: string;
  verdict?: Verdict;
  contre: Contre;
};

type Combat = {
  id: string;
  motsCles: string;
  typeCombat: string;
  groupe: string;
  arbitre: Arbitre;
  combattants: Combattant[];
  contexte: Contexte;
  situation: Situation;
  deroulement?: Tour[];
};

// Type pour l'édition d'un tour
type EditingTour = {
  combatId: string;
  tourNumber: number;
  contres: Array<{
    id: string;
    auteur: string;
    texte: string;
    combattant: string;
    rolisteId: string;
  }>;
  verdicts: Array<{
    id: string;
    auteur: string;
    texte: string;
    fin: boolean;
    pause: boolean;
    poursuite: boolean;
  }>;
};

// Type pour les notifications
type Notification = {
  id: string;
  type: 'success' | 'error';
  message: string;
};

// ==================== COMPOSANT DE NOTIFICATION ====================

const NotificationToast = ({ notification, onClose }: { notification: Notification; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-20 right-4 z-[100] p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
        notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {notification.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-white" />
      ) : (
        <AlertCircle className="w-5 h-5 text-white" />
      )}
      <p className="text-white font-medium">{notification.message}</p>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================

export default function CombatsPage() {
  const [combats, setCombats] = useState<Combat[]>([]);
  const [selectedCombat, setSelectedCombat] = useState<Combat | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCombat, setEditingCombat] = useState<Combat | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPaves, setLoadingPaves] = useState(false);
  const [expandedTexts, setExpandedTexts] = useState<Set<string>>(new Set());
  const [editingTour, setEditingTour] = useState<EditingTour | null>(null);
  const [savingTour, setSavingTour] = useState(false);
  const [savingCombat, setSavingCombat] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentStep, setCurrentStep] = useState<'general' | 'combattants' | 'contexte' | 'deroulement'>('general');

  // URLs de l'API
  const API_URL_LOCAL = "http://localhost:3001/combats";
  const API_URL = "https://datarikbook-api.vercel.app/combats";
  const API_URL_LOCAL_PAVES = "http://localhost:3001/combats/getPaves";
  const API_URL_PAVES = "https://datarikbook-api.vercel.app/combats/getPaves";
  const API_BASE = API_URL;

  // Fonction pour ajouter une notification
  const addNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  // Fonction pour supprimer une notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // État initial du formulaire
  const [formData, setFormData] = useState<Partial<Combat>>({
    motsCles: '',
    typeCombat: '',
    groupe: '',
    arbitre: {
      presence: false,
      idArbitre: '',
      nom: '',
      pseudo: ''
    },
    combattants: [
      {
        solo: true,
        roliste: '',
        rolisteRemplacement: false,
        rolisteRemplace: '',
        clan: '',
        nom: '',
        image: '',
        idPersonnage: '',
        clan2: '',
        nom2: '',
        image2: '',
        idPersonnage2: '',
        vainqueur: false,
        perdant: false,
        nul: false
      },
      {
        solo: true,
        roliste: '',
        rolisteRemplacement: false,
        rolisteRemplace: '',
        clan: '',
        nom: '',
        image: '',
        idPersonnage: '',
        clan2: '',
        nom2: '',
        image2: '',
        idPersonnage2: '',
        vainqueur: false,
        perdant: false,
        nul: false
      }
    ],
    contexte: {
      description: '',
      latence: { presence: false, delai: 0, typeLatence: 'min' }
    },
    situation: {
      fin: false,
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: ''
    },
    deroulement: []
  });

  // Charger les combats depuis l'API
  const fetchCombats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_LOCAL}/liste`);
      if (response.ok) {
        const data = await response.json();
        if (data.ok && Array.isArray(data.liste)) {
          setCombats(data.liste.map(convertApiCombatToLocal));
          setLoading(false);
          return;
        }
      }
      throw new Error('Erreur lors de la récupération des combats');
    } catch (error) {
      console.error('Erreur API:', error);
      // Fallback : charger depuis localStorage
      const savedCombats = localStorage.getItem('combats');
      if (savedCombats) {
        setCombats(JSON.parse(savedCombats));
      }
    } finally {
      setLoading(false);
    }
  };

  // Convertir les données de l'API au format local
  const convertApiCombatToLocal = (apiCombat: any): Combat => {
    return {
      id: apiCombat.id || apiCombat._id || Date.now().toString(),
      motsCles: apiCombat.motsCles || '',
      typeCombat: apiCombat.typeCombat || '',
      groupe: apiCombat.groupe || '',
      arbitre: {
        presence: apiCombat.arbitre?.presence || false,
        idArbitre: apiCombat.arbitre?.idArbitre || '',
        nom: apiCombat.arbitre?.nom || '',
        pseudo: apiCombat.arbitre?.pseudo || ''
      },
      combattants: apiCombat.combattants || [],
      contexte: apiCombat.contexte || {
        description: '',
        latence: { presence: false, delai: 0, typeLatence: 'min' }
      },
      situation: apiCombat.situation || {
        fin: false,
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: ''
      },
      deroulement: apiCombat.deroulement || []
    };
  };

  // Charger les combats au montage
  useEffect(() => {
    fetchCombats();
  }, []);

  // Créer un nouveau combat
  const createCombat = async () => {
    setSavingCombat(true);
    try {
      const combatToSend = {
        ...formData,
        deroulement: formData.deroulement || []
      };

      console.log(combatToSend);

      const response = await fetch(`${API_URL_LOCAL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combatToSend)
      });


      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          addNotification('success', 'Combat créé avec succès !');
          await fetchCombats();
          resetForm();
          return;
        }
      }
      throw new Error('Erreur lors de la création du combat');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      addNotification('error', 'Erreur lors de la création du combat');
    } finally {
      setSavingCombat(false);
    }
  };

  // Modifier un combat
  const updateCombat = async () => {
    if (!editingCombat) return;
    
    setSavingCombat(true);
    try {
      const response = await fetch(`${API_BASE}/update/${editingCombat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          addNotification('success', 'Combat mis à jour avec succès !');
          await fetchCombats();
          setIsEditing(false);
          setEditingCombat(null);
          setShowForm(false);
          resetForm();
          return;
        }
      }
      throw new Error('Erreur lors de la mise à jour du combat');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      addNotification('error', 'Erreur lors de la mise à jour du combat');
    } finally {
      setSavingCombat(false);
    }
  };

  // Supprimer un combat
  const deleteCombat = async (combatId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce combat ?')) return;

    try {
      const response = await fetch(`${API_BASE}/delete/${combatId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          addNotification('success', 'Combat supprimé avec succès !');
          await fetchCombats();
          return;
        }
      }
      throw new Error('Erreur lors de la suppression du combat');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      addNotification('error', 'Erreur lors de la suppression du combat');
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      motsCles: '',
      typeCombat: '',
      groupe: '',
      arbitre: {
        presence: false,
        idArbitre: '',
        nom: '',
        pseudo: ''
      },
      combattants: [
        {
          solo: true,
          roliste: '',
          rolisteRemplacement: false,
          rolisteRemplace: '',
          clan: '',
          nom: '',
          image: '',
          idPersonnage: '',
          clan2: '',
          nom2: '',
          image2: '',
          idPersonnage2: '',
          vainqueur: false,
          perdant: false,
          nul: false
        },
        {
          solo: true,
          roliste: '',
          rolisteRemplacement: false,
          rolisteRemplace: '',
          clan: '',
          nom: '',
          image: '',
          idPersonnage: '',
          clan2: '',
          nom2: '',
          image2: '',
          idPersonnage2: '',
          vainqueur: false,
          perdant: false,
          nul: false
        }
      ],
      contexte: {
        description: '',
        latence: { presence: false, delai: 0, typeLatence: 'min' }
      },
      situation: {
        fin: false,
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: ''
      },
      deroulement: []
    });
    setCurrentStep('general');
    setShowForm(false);
    setIsEditing(false);
    setEditingCombat(null);
  };

  // Éditer un combat
  const editCombat = (combat: Combat) => {
    setEditingCombat(combat);
    setFormData(combat);
    setIsEditing(true);
    setShowForm(true);
    setCurrentStep('general');
  };

  // Récupérer les pavés d'un combat depuis l'API
  const fetchPaves = async (combatId: string) => {
    setLoadingPaves(true);
    try {
      const response = await fetch(`${API_URL_LOCAL_PAVES}/${combatId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.ok && Array.isArray(data.paves)) {
          const updatedCombats = combats.map(combat => {
            if (combat.id === combatId) {
              return { ...combat, deroulement: data.paves };
            }
            return combat;
          });
          setCombats(updatedCombats);
          localStorage.setItem('combats', JSON.stringify(updatedCombats));
          
          if (selectedCombat && selectedCombat.id === combatId) {
            setSelectedCombat({ ...selectedCombat, deroulement: data.paves });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des pavés:', error);
    } finally {
      setLoadingPaves(false);
    }
  };

  // Ouvrir les détails d'un combat
  const openCombatDetails = async (combat: Combat) => {
    setSelectedCombat(combat);
    await fetchPaves(combat.id);
  };

  // ==================== GESTION DES TOURS ====================

  // Fonction pour basculer l'affichage d'un texte
  const toggleTextExpansion = (textId: string) => {
    setExpandedTexts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(textId)) {
        newSet.delete(textId);
      } else {
        newSet.add(textId);
      }
      return newSet;
    });
  };

  // Fonction pour vérifier si un texte est long (plus de 8 lignes)
  const isTextLong = (text: string) => {
    if (!text) return false;
    const lines = text.split('\n').length;
    return lines > 8;
  };

  // Fonction pour tronquer le texte à 8 lignes
  const truncateText = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    if (lines.length <= 8) return text;
    return lines.slice(0, 8).join('\n');
  };

  // Fonction pour générer un ID unique pour chaque texte
  const generateTextId = (tourNumber: number, itemIndex: number, isVerdict: boolean) => {
    return `${tourNumber}-${itemIndex}-${isVerdict ? 'verdict' : 'contre'}`;
  };

  // Commencer l'édition d'un tour
  const startEditingTour = (combatId: string) => {
    const combat = combats.find(c => c.id === combatId);
    if (!combat) return;

    const newTourNumber = Math.max(0, ...(combat.deroulement || []).map(t => t.tour)) + 1;
    const hasArbitre = combat.arbitre.presence;

    // Créer les contres initiaux selon les règles
    let initialContres: Array<{
      id: string;
      auteur: string;
      texte: string;
      combattant: string;
      rolisteId: string;
    }> = [];

    if (hasArbitre) {
      // Combat avec arbitre : 1 contre par combattant
      initialContres = combat.combattants.map((combattant, index) => ({
        id: `contre-${index + 1}-${Date.now()}`,
        auteur: combattant.roliste,
        texte: '',
        combattant: `${combattant.nom} ${combattant.clan}`,
        rolisteId: combattant.idPersonnage
      }));
    } else {
      // Combat sans arbitre : 2 contres (un par combattant)
      initialContres = combat.combattants.map((combattant, index) => ({
        id: `contre-${index + 1}-${Date.now()}`,
        auteur: combattant.roliste,
        texte: '',
        combattant: `${combattant.nom} ${combattant.clan}`,
        rolisteId: combattant.idPersonnage
      }));
    }

    setEditingTour({
      combatId,
      tourNumber: newTourNumber,
      contres: initialContres,
      verdicts: hasArbitre ? [{
        id: `verdict-1-${Date.now()}`,
        auteur: combat.arbitre.nom || combat.arbitre.pseudo || 'Arbitre',
        texte: '',
        fin: false,
        pause: false,
        poursuite: true
      }] : []
    });
  };

  // Ajouter un contre au tour
  const addContreToTour = () => {
    if (!editingTour) return;

    const combat = combats.find(c => c.id === editingTour.combatId);
    if (!combat) return;

    const defaultCombattant = combat.combattants[0];
    const newContre = {
      id: `contre-${Date.now()}`,
      auteur: defaultCombattant.roliste,
      texte: '',
      combattant: `${defaultCombattant.nom} ${defaultCombattant.clan}`,
      rolisteId: defaultCombattant.idPersonnage
    };

    setEditingTour({
      ...editingTour,
      contres: [...editingTour.contres, newContre]
    });
  };

  // Ajouter un verdict au tour
  const addVerdictToTour = () => {
    if (!editingTour) return;

    const combat = combats.find(c => c.id === editingTour.combatId);
    if (!combat || !combat.arbitre.presence) return;

    const newVerdict = {
      id: `verdict-${Date.now()}`,
      auteur: combat.arbitre.nom || combat.arbitre.pseudo || 'Arbitre',
      texte: '',
      fin: false,
      pause: false,
      poursuite: true
    };

    setEditingTour({
      ...editingTour,
      verdicts: [...editingTour.verdicts, newVerdict]
    });
  };

  // Mettre à jour un contre
  const updateContre = (contreId: string, field: string, value: any) => {
    if (!editingTour) return;

    setEditingTour({
      ...editingTour,
      contres: editingTour.contres.map(contre => {
        if (contre.id === contreId) {
          if (field === 'combattant') {
            const combat = combats.find(c => c.id === editingTour.combatId);
            if (combat) {
              const selectedCombattant = combat.combattants.find(c => 
                `${c.nom} ${c.clan}` === value
              );
              if (selectedCombattant) {
                return {
                  ...contre,
                  [field]: value,
                  auteur: selectedCombattant.roliste,
                  rolisteId: selectedCombattant.idPersonnage
                };
              }
            }
          }
          return { ...contre, [field]: value };
        }
        return contre;
      })
    });
  };

  // Mettre à jour un verdict
  const updateVerdict = (verdictId: string, field: string, value: any) => {
    if (!editingTour) return;

    setEditingTour({
      ...editingTour,
      verdicts: editingTour.verdicts.map(verdict =>
        verdict.id === verdictId ? { ...verdict, [field]: value } : verdict
      )
    });
  };

  // Supprimer un contre
  const removeContre = (contreId: string) => {
    if (!editingTour) return;

    setEditingTour({
      ...editingTour,
      contres: editingTour.contres.filter(contre => contre.id !== contreId)
    });
  };

  // Supprimer un verdict
  const removeVerdict = (verdictId: string) => {
    if (!editingTour) return;

    setEditingTour({
      ...editingTour,
      verdicts: editingTour.verdicts.filter(verdict => verdict.id !== verdictId)
    });
  };

  // Sauvegarder le tour
  const saveTour = async () => {
    if (!editingTour || savingTour) return;

    const combat = combats.find(c => c.id === editingTour.combatId);
    if (!combat) return;

    setSavingTour(true);

    try {
      const now = new Date();
      const date = now.toLocaleDateString('fr-FR');
      const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

      const newTourItems: Tour[] = [];

      // Ajouter les contres
      editingTour.contres.forEach((contre) => {
        if (contre.texte.trim() !== '') {
          newTourItems.push({
            tour: editingTour.tourNumber,
            arbitre: false,
            auteur: contre.auteur,
            contre: {
              date,
              heure,
              combattant: contre.combattant,
              reactions: { like: 0, dislike: 0, surpris: 0, triste: 0, drole: 0 },
              image: '',
              texte: contre.texte,
              actionCaches: { presence: false, listeTechniques: [], texte: '' }
            }
          });
        }
      });

      // Ajouter les verdicts (si arbitre présent)
      if (combat.arbitre.presence) {
        editingTour.verdicts.forEach((verdict) => {
          if (verdict.texte.trim() !== '') {
            newTourItems.push({
              tour: editingTour.tourNumber,
              arbitre: true,
              auteur: verdict.auteur,
              verdict: {
                auteur: verdict.auteur,
                fin: verdict.fin,
                pause: verdict.pause,
                poursuite: verdict.poursuite,
                texte: verdict.texte,
                image: '',
                revendications: []
              },
              contre: {
                date,
                heure,
                combattant: '',
                reactions: { like: 0, dislike: 0, surpris: 0, triste: 0, drole: 0 },
                image: '',
                texte: '',
                actionCaches: { presence: false, listeTechniques: [], texte: '' }
              }
            });
          }
        });
      }

      // Envoyer à l'API
      const tourData = {
        combatId: editingTour.combatId,
        tourNumber: editingTour.tourNumber,
        contres: editingTour.contres.filter(c => c.texte.trim() !== ''),
        verdicts: editingTour.verdicts.filter(v => v.texte.trim() !== '')
      };

      const response = await fetch(`${API_URL_LOCAL}/addTour/${editingTour.combatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          addNotification('success', 'Tour ajouté avec succès !');
          await fetchCombats();
          
          if (selectedCombat && selectedCombat.id === editingTour.combatId) {
            const updatedCombat = combats.find(c => c.id === editingTour.combatId);
            if (updatedCombat) {
              setSelectedCombat(updatedCombat);
            }
          }
          
          setEditingTour(null);
          return;
        }
      }

      throw new Error('Erreur lors de l\'ajout du tour');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tour:', error);
      addNotification('error', 'Erreur lors de l\'ajout du tour');
    } finally {
      setSavingTour(false);
    }
  };

  // Annuler l'édition du tour
  const cancelTourEditing = () => {
    setEditingTour(null);
  };

  // ==================== RENDU ====================

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gradient-to-br from-gray-900 to-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-xl">Chargement des combats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
      <div className="container mx-auto px-4">
        {/* Notifications */}
        <AnimatePresence>
          {notifications.map(notification => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-300 mb-4">Gestion des Combats</h1>
          <p className="text-gray-400">Créez et gérez vos combats RP avec ou sans arbitre</p>
        </div>

        {/* Bouton Nouveau Combat */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Combat</span>
          </button>
        </div>

        {/* Liste des Combats */}
        {combats.length === 0 ? (
          <div className="text-center py-12">
            <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun combat pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {combats.map((combat) => (
              <motion.div
                key={combat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all"
              >
                {/* Header du combat */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Sword className="w-5 h-5 text-red-400" />
                    <span className="font-semibold text-lg">
                      {combat.combattants[0]?.nom || 'Combattant 1'} vs {combat.combattants[1]?.nom || 'Combattant 2'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editCombat(combat)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCombat(combat.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Infos du combat */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{combat.combattants[0]?.roliste || 'Rôliste 1'} vs {combat.combattants[1]?.roliste || 'Rôliste 2'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {combat.situation?.dateDebut ? new Date(combat.situation.dateDebut).toLocaleDateString('fr-FR') : 'Date début'}
                      {combat.situation?.dateFin ? ' - ' : ''}
                      {combat.situation?.dateFin ? new Date(combat.situation.dateFin).toLocaleDateString('fr-FR') : 'En cours'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{(combat.deroulement || []).length} tour{(combat.deroulement || []).length > 1 ? 's' : ''}</span>
                  </div>
                  {combat.arbitre?.presence && (
                    <div className="text-sm text-yellow-400">
                      ⚖️ Arbitre: {combat.arbitre.nom || combat.arbitre.pseudo || 'Non défini'}
                    </div>
                  )}
                  {combat.typeCombat && (
                    <div className="text-sm text-gray-400">
                      Type: {combat.typeCombat}
                    </div>
                  )}
                </div>

                {/* Statut */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    combat.situation?.fin ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                  }`}>
                    {combat.situation?.fin ? 'Terminé' : 'En cours'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => openCombatDetails(combat)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    Voir détails
                  </button>
                  <button
                    onClick={() => startEditingTour(combat.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    disabled={editingTour !== null}
                  >
                    + Tour
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modale de création/édition de combat */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  resetForm();
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {isEditing ? 'Modifier le Combat' : 'Nouveau Combat'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation par étapes */}
                <div className="flex space-x-2 mb-6 border-b border-gray-700">
                  {(['general', 'combattants', 'contexte', 'deroulement'] as const).map((step) => (
                    <button
                      key={step}
                      onClick={() => setCurrentStep(step)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        currentStep === step
                          ? 'border-b-2 border-blue-500 text-blue-400'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {step === 'general' && 'Général'}
                      {step === 'combattants' && 'Combattants'}
                      {step === 'contexte' && 'Contexte'}
                      {step === 'deroulement' && 'Déroulement'}
                    </button>
                  ))}
                </div>

                {/* Formulaire par étape */}
                <div className="space-y-6">
                  {/* Étape 1: Informations générales */}
                  {currentStep === 'general' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Mots-clés</label>
                        <input
                          type="text"
                          placeholder="naruto oc whatsapp privé..."
                          value={formData.motsCles || ''}
                          onChange={(e) => setFormData({ ...formData, motsCles: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                      </div>

                      {/* Type de combat */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Type de combat</label>
                        <input
                          type="text"
                          placeholder="naruto oc"
                          value={formData.typeCombat || ''}
                          onChange={(e) => setFormData({ ...formData, typeCombat: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                      </div>

                      {/* Groupe */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Groupe</label>
                        <input
                          type="text"
                          placeholder="Groupe (optionnel)"
                          value={formData.groupe || ''}
                          onChange={(e) => setFormData({ ...formData, groupe: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                      </div>

                      {/* Arbitre */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Présence d'un arbitre</label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.arbitre?.presence || false}
                              onChange={(e) => setFormData({
                                ...formData,
                                arbitre: { ...formData.arbitre!, presence: e.target.checked }
                              })}
                              className="mr-2"
                            />
                            <span>Oui</span>
                          </label>
                        </div>
                        {formData.arbitre?.presence && (
                          <div className="mt-3 space-y-3">
                            <input
                              type="text"
                              placeholder="ID Arbitre"
                              value={formData.arbitre.idArbitre || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                arbitre: {
                                  ...formData.arbitre!,
                                  idArbitre: e.target.value
                                }
                              })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <input
                              type="text"
                              placeholder="Nom de l'arbitre"
                              value={formData.arbitre.nom || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                arbitre: {
                                  ...formData.arbitre!,
                                  nom: e.target.value
                                }
                              })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <input
                              type="text"
                              placeholder="Pseudo de l'arbitre"
                              value={formData.arbitre.pseudo || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                arbitre: {
                                  ...formData.arbitre!,
                                  pseudo: e.target.value
                                }
                              })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Date de début</label>
                          <input
                            type="date"
                            value={formData.situation?.dateDebut || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              situation: { ...formData.situation!, dateDebut: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Date de fin (optionnel)</label>
                          <input
                            type="date"
                            value={formData.situation?.dateFin || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              situation: { ...formData.situation!, dateFin: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.situation?.fin || false}
                            onChange={(e) => setFormData({
                              ...formData,
                              situation: { ...formData.situation!, fin: e.target.checked }
                            })}
                            className="mr-2"
                          />
                          <span>Combat terminé</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Combattants */}
                  {currentStep === 'combattants' && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Combattants</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[0, 1].map((index) => (
                          <div key={index} className="space-y-3 p-4 bg-gray-700 rounded">
                            <h4 className="font-medium text-blue-300">Combattant {index + 1}</h4>
                            <input
                              type="text"
                              placeholder="Rôliste"
                              value={formData.combattants?.[index]?.roliste || ''}
                              onChange={(e) => {
                                const newCombattants = [...(formData.combattants || [])];
                                newCombattants[index] = { ...newCombattants[index], roliste: e.target.value };
                                setFormData({ ...formData, combattants: newCombattants });
                              }}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                            />
                            <input
                              type="text"
                              placeholder="Clan"
                              value={formData.combattants?.[index]?.clan || ''}
                              onChange={(e) => {
                                const newCombattants = [...(formData.combattants || [])];
                                newCombattants[index] = { ...newCombattants[index], clan: e.target.value };
                                setFormData({ ...formData, combattants: newCombattants });
                              }}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                            />
                            <input
                              type="text"
                              placeholder="Nom du personnage"
                              value={formData.combattants?.[index]?.nom || ''}
                              onChange={(e) => {
                                const newCombattants = [...(formData.combattants || [])];
                                newCombattants[index] = { ...newCombattants[index], nom: e.target.value };
                                setFormData({ ...formData, combattants: newCombattants });
                              }}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                            />
                            <input
                              type="text"
                              placeholder="ID Personnage"
                              value={formData.combattants?.[index]?.idPersonnage || ''}
                              onChange={(e) => {
                                const newCombattants = [...(formData.combattants || [])];
                                newCombattants[index] = { ...newCombattants[index], idPersonnage: e.target.value };
                                setFormData({ ...formData, combattants: newCombattants });
                              }}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                            />
                            <input
                              type="text"
                              placeholder="Image (URL)"
                              value={formData.combattants?.[index]?.image || ''}
                              onChange={(e) => {
                                const newCombattants = [...(formData.combattants || [])];
                                newCombattants[index] = { ...newCombattants[index], image: e.target.value };
                                setFormData({ ...formData, combattants: newCombattants });
                              }}
                              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                            />
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.combattants?.[index]?.vainqueur || false}
                                  onChange={(e) => {
                                    const newCombattants = [...(formData.combattants || [])];
                                    newCombattants[index] = { ...newCombattants[index], vainqueur: e.target.checked, perdant: false, nul: false };
                                    setFormData({ ...formData, combattants: newCombattants });
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm">Vainqueur</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.combattants?.[index]?.perdant || false}
                                  onChange={(e) => {
                                    const newCombattants = [...(formData.combattants || [])];
                                    newCombattants[index] = { ...newCombattants[index], perdant: e.target.checked, vainqueur: false, nul: false };
                                    setFormData({ ...formData, combattants: newCombattants });
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm">Perdant</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.combattants?.[index]?.nul || false}
                                  onChange={(e) => {
                                    const newCombattants = [...(formData.combattants || [])];
                                    newCombattants[index] = { ...newCombattants[index], nul: e.target.checked, vainqueur: false, perdant: false };
                                    setFormData({ ...formData, combattants: newCombattants });
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm">Nul</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Étape 3: Contexte */}
                  {currentStep === 'contexte' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Description du contexte</label>
                      <textarea
                        placeholder="Décrivez le contexte du combat..."
                        value={formData.contexte?.description || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          contexte: { ...formData.contexte!, description: e.target.value }
                        })}
                        rows={5}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.contexte?.latence?.presence || false}
                            onChange={(e) => setFormData({
                              ...formData,
                              contexte: {
                                ...formData.contexte!,
                                latence: { ...formData.contexte!.latence, presence: e.target.checked }
                              }
                            })}
                            className="mr-2"
                          />
                          <span>Latence</span>
                        </label>
                        {formData.contexte?.latence?.presence && (
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <input
                              type="number"
                              placeholder="Délai"
                              value={formData.contexte.latence.delai || 0}
                              onChange={(e) => setFormData({
                                ...formData,
                                contexte: {
                                  ...formData.contexte!,
                                  latence: { ...formData.contexte!.latence, delai: parseInt(e.target.value) || 0 }
                                }
                              })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <select
                              value={formData.contexte.latence.typeLatence || 'min'}
                              onChange={(e) => setFormData({
                                ...formData,
                                contexte: {
                                  ...formData.contexte!,
                                  latence: { ...formData.contexte!.latence, typeLatence: e.target.value as 'min' | 'h' | 'j' }
                                }
                              })}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                            >
                              <option value="min">Minutes</option>
                              <option value="h">Heures</option>
                              <option value="j">Jours</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Étape 4: Déroulement (lecture seule dans le formulaire) */}
                  {currentStep === 'deroulement' && (
                    <div>
                      <p className="text-gray-400">
                        Les tours seront ajoutés après la création du combat. Utilisez le bouton "+ Tour" sur la carte du combat.
                      </p>
                    </div>
                  )}

                  {/* Boutons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-600">
                    <button
                      onClick={isEditing ? updateCombat : createCombat}
                      disabled={savingCombat}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {savingCombat ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sauvegarde...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{isEditing ? 'Sauvegarder' : 'Créer le Combat'}</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetForm}
                      disabled={savingCombat}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modale de détails du combat */}
        <AnimatePresence>
          {selectedCombat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedCombat(null);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Titre du combat */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Détails du Combat: {selectedCombat.combattants[0]?.nom || 'Combattant 1'} vs {selectedCombat.combattants[1]?.nom || 'Combattant 2'}
                  </h2>
                  <button
                    onClick={() => setSelectedCombat(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Détails du combat */}
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700 p-4 rounded">
                      <h3 className="text-lg font-medium mb-3 text-blue-300">Informations</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Statut :</span> {selectedCombat.situation?.fin ? 'Terminé' : 'En cours'}</p>
                        <p><span className="font-medium">Début :</span> {selectedCombat.situation?.dateDebut ? new Date(selectedCombat.situation.dateDebut).toLocaleDateString('fr-FR') : 'Non définie'}</p>
                        <p><span className="font-medium">Fin :</span> {selectedCombat.situation?.dateFin ? new Date(selectedCombat.situation.dateFin).toLocaleDateString('fr-FR') : 'Non définie'}</p>
                        <p><span className="font-medium">Type :</span> {selectedCombat.typeCombat || 'Non défini'}</p>
                        {selectedCombat.arbitre?.presence && (
                          <>
                            <p><span className="font-medium">Arbitre :</span> Oui</p>
                            <p><span className="font-medium">Nom :</span> {selectedCombat.arbitre.nom || selectedCombat.arbitre.pseudo || 'Non défini'}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <h3 className="text-lg font-medium mb-3 text-blue-300">Contexte</h3>
                      <p className="text-sm">{selectedCombat.contexte?.description || 'Aucune description'}</p>
                    </div>
                  </div>

                  {/* Déroulement */}
                  <div>
                    {/* Informations du tour */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-blue-300">Déroulement</h3>
                      <div className='flex space-x-2'>
                        {loadingPaves && (
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            <span>Chargement...</span>
                          </div>
                        )}
                        <button
                          onClick={() => startEditingTour(selectedCombat.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                          disabled={editingTour !== null}
                        >
                          + Tour
                        </button>
                      </div>
                    </div>
                    
                    {!selectedCombat.deroulement || selectedCombat.deroulement.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Aucun tour pour le moment</p>
                    ) : (
                      <div className="space-y-4">
                        {Array.from(new Set((selectedCombat.deroulement || []).map(t => t.tour))).map((tourNumber) => {
                          const tourItems = (selectedCombat.deroulement || []).filter(t => t.tour === tourNumber);
                          return (
                            <div key={tourNumber} className="bg-gray-700 p-4 rounded border-l-4 border-blue-500">
                              {/* Consulter ou Supprimer le tour */}
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-medium text-yellow-300">Tour {tourNumber}</h4>
                                <button
                                    // onClick={() => deleteTour(selectedCombat.id, tourNumber - 1)}
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Supprimer le tour
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                {tourItems.map((item, index) => {
                                    const textId = generateTextId(tourNumber, index, item.arbitre);
                                    const isExpanded = expandedTexts.has(textId);
                                    const isLong = item.arbitre ? isTextLong(item.verdict?.texte || '') : isTextLong(item.contre?.texte || '');
                                    const displayText = item.arbitre ? (item.verdict?.texte || '') : (item.contre?.texte || '');
                                    const truncatedText = truncateText(displayText);
                                    
                                    return (
                                        <div key={index} className={`p-3 rounded ${
                                            item.arbitre ? 'bg-yellow-900/30 border-l-4 border-yellow-500' : 'bg-gray-600 border-l-4 border-blue-500'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`font-medium ${
                                                    item.arbitre ? 'text-yellow-300' : 'text-blue-300'
                                                }`}>
                                                    {item.arbitre ? 'Verdict' : 'Contre'} - {item.auteur}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {item.contre?.date} {item.contre?.heure}
                                                </span>
                                            </div>
                                            
                                            {item.arbitre ? (
                                            <div>
                                                <p className="text-sm mb-2 whitespace-pre-line">
                                                {isLong && !isExpanded ? truncatedText : displayText}
                                                </p>
                                                {isLong && (
                                                <button
                                                    onClick={() => toggleTextExpansion(textId)}
                                                    className="text-blue-400 hover:text-blue-300 text-xs underline mb-2"
                                                >
                                                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                                                </button>
                                                )}
                                                <div className="flex space-x-2 text-xs">
                                                <span className={`px-2 py-1 rounded ${
                                                    item.verdict?.fin ? 'bg-red-600' : 'bg-green-600'
                                                }`}>
                                                    {item.verdict?.fin ? 'Fin' : 'Continue'}
                                                </span>
                                                <span className={`px-2 py-1 rounded ${
                                                    item.verdict?.pause ? 'bg-yellow-600' : 'bg-blue-600'
                                                }`}>
                                                    {item.verdict?.pause ? 'Pause' : 'Actif'}
                                                </span>
                                                </div>
                                          </div>
                                            ) : (
                                              <div>
                                                <p className="text-sm mb-2 whitespace-pre-line">
                                                  {isLong && !isExpanded ? truncatedText : displayText}
                                                </p>
                                                {isLong && (
                                                  <button
                                                    onClick={() => toggleTextExpansion(textId)}
                                                    className="text-blue-400 hover:text-blue-300 text-xs underline mb-2"
                                                  >
                                                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                                                  </button>
                                                )}
                                                <p className="text-xs text-gray-400">
                                                  Combattant: {item.contre?.combattant}
                                                </p>
                                              </div>
                                            )}
                                        </div>
                                    )
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modale d'édition de tour */}
        <AnimatePresence>
          {editingTour && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  cancelTourEditing();
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Nouveau Tour {editingTour.tourNumber}
                  </h2>
                  <button
                    onClick={cancelTourEditing}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Contres */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-blue-300">Contres</h3>
                      <button
                        onClick={addContreToTour}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un contre</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {editingTour.contres.map((contre, index) => {
                        const combat = combats.find(c => c.id === editingTour.combatId);
                        return (
                          <div key={contre.id} className="bg-gray-700 p-4 rounded border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-blue-300">Contre {index + 1}</h4>
                              {editingTour.contres.length > 1 && (
                                <button
                                  onClick={() => removeContre(contre.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <MinusCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium mb-1">Combattant</label>
                                <select
                                  value={contre.combattant}
                                  onChange={(e) => updateContre(contre.id, 'combattant', e.target.value)}
                                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                                >
                                  <option value="">Sélectionner un combattant</option>
                                  {combat?.combattants.map((combattant, idx) => (
                                    <option key={idx} value={`${combattant.nom} ${combattant.clan}`}>
                                      {combattant.nom} {combattant.clan} ({combattant.roliste})
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">Texte du contre</label>
                                <textarea
                                  placeholder="Saisissez le texte du contre..."
                                  value={contre.texte}
                                  onChange={(e) => updateContre(contre.id, 'texte', e.target.value)}
                                  rows={5}
                                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Verdicts (si combat arbitré) */}
                  {combats.find(c => c.id === editingTour.combatId)?.arbitre.presence && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-yellow-300">Verdicts</h3>
                        <button
                          onClick={addVerdictToTour}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Ajouter un verdict</span>
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {editingTour.verdicts.map((verdict, index) => (
                          <div key={verdict.id} className="bg-gray-700 p-4 rounded border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-yellow-300">Verdict {index + 1}</h4>
                              {editingTour.verdicts.length > 1 && (
                                <button
                                  onClick={() => removeVerdict(verdict.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <MinusCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium mb-1">Texte du verdict</label>
                                <textarea
                                  placeholder="Saisissez le texte du verdict..."
                                  value={verdict.texte}
                                  onChange={(e) => updateVerdict(verdict.id, 'texte', e.target.value)}
                                  rows={5}
                                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                                />
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={verdict.fin}
                                    onChange={(e) => updateVerdict(verdict.id, 'fin', e.target.checked)}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">Combat terminé</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={verdict.pause}
                                    onChange={(e) => updateVerdict(verdict.id, 'pause', e.target.checked)}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">Combat en pause</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={verdict.poursuite}
                                    onChange={(e) => updateVerdict(verdict.id, 'poursuite', e.target.checked)}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">Combat continue</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-600">
                    <button
                      onClick={saveTour}
                      disabled={savingTour}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {savingTour ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sauvegarde...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Sauvegarder le tour</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={cancelTourEditing}
                      disabled={savingTour}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
