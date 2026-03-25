'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Users, Calendar, Clock, Sword, MinusCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// Data à exploiter
import combatsNinja from '@/data/Fight_Arene_3.json';
import contenuCombatsNinja from '@/data/Messages_Fight_Arene_3.json';

// Types basés sur rpData.js
type Arbitre = {
  presence: boolean;
  principal?: {
    idArbitre: string;
    nom: string;
    pseudo: string;
  };
  idArbitre?: string;
  nom?: string;
  pseudo?: string;
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
  lastDate: string;
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
  arbitre: Arbitre;
  combattants: Combattant[];
  contexte: Contexte;
  situation: Situation;
  deroulement: Tour[];
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

  // URLs de l'API
  const API_URL_COMBATS = "http://localhost:3001/combats/liste";
  const API_URL_PAVES = "http://localhost:3001/combats/getPaves";
  const API_URL_CREATE_COMBAT = "http://localhost:3001/combats/create";
  const API_URL_UPDATE_COMBAT = "http://localhost:3001/combats/update";
  const API_URL_DELETE_COMBAT = "http://localhost:3001/combats/delete";
  const API_URL_ADD_TOUR = "http://localhost:3001/combats/addTour";

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

  // Fonction pour commencer l'édition d'un tour
  const startEditingTour = (combatId: string) => {
    const combat = combats.find(c => c.id === combatId);
    if (!combat) return;

    const newTourNumber = Math.max(0, ...combat.deroulement.map(t => t.tour)) + 1;
    const hasArbitre = combat.arbitre.presence;

    // Créer les contres initiaux pour chaque combattant
    const initialContres = combat.combattants.map((combattant, index) => ({
      id: `contre-${index + 1}-${Date.now()}`,
      auteur: combattant.roliste,
      texte: '',
      combattant: `${combattant.nom} ${combattant.clan}`,
      rolisteId: combattant.idPersonnage
    }));

    setEditingTour({
      combatId,
      tourNumber: newTourNumber,
      contres: initialContres,
      verdicts: hasArbitre ? [{
        id: `verdict-1-${Date.now()}`,
        auteur: combat.arbitre.principal?.pseudo || combat.arbitre.principal?.nom || 'Arbitre',
        texte: '',
        fin: false,
        pause: false,
        poursuite: true
      }] : []
    });
  };

  // Fonction pour ajouter un contre au tour en cours d'édition
  const addContreToTour = () => {
    if (!editingTour) return;

    const combat = combats.find(c => c.id === editingTour.combatId);
    if (!combat) return;

    // Proposer le premier combattant par défaut
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

  // Fonction pour ajouter un verdict au tour en cours d'édition
  const addVerdictToTour = () => {
    if (!editingTour) return;

    const combat = combats.find(c => c.id === editingTour.combatId);
    if (!combat || !combat.arbitre.presence) return;

    const newVerdict = {
      id: `verdict-${Date.now()}`,
      auteur: combat.arbitre.principal?.pseudo || combat.arbitre.principal?.nom || 'Arbitre',
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

  // Fonction pour mettre à jour un contre
  const updateContre = (contreId: string, field: string, value: any) => {
    if (!editingTour) return;

    setEditingTour({
      ...editingTour,
      contres: editingTour.contres.map(contre => {
        if (contre.id === contreId) {
          // Si on change le combattant, mettre à jour l'auteur aussi
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

  // Fonction pour mettre à jour un verdict
  const updateVerdict = (verdictId: string, field: string, value: any) => {
    if (!editingTour) return;

    setEditingTour({
      ...editingTour,
      verdicts: editingTour.verdicts.map(verdict =>
        verdict.id === verdictId ? { ...verdict, [field]: value } : verdict
      )
    });
  };

  // Fonction pour supprimer un contre
  const removeContre = (contreId: string) => {
    if (!editingTour) return;

    setEditingTour({
      ...editingTour,
      contres: editingTour.contres.filter(contre => contre.id !== contreId)
    });
  };

  // Fonction pour supprimer un verdict
  const removeVerdict = (verdictId: string) => {
    if (!editingTour) return;

    setEditingTour({
      ...editingTour,
      verdicts: editingTour.verdicts.filter(verdict => verdict.id !== verdictId)
    });
  };

  // Fonction pour sauvegarder le tour via l'API
  const saveTour = async () => {
    if (!editingTour || savingTour) return;

    const combat = combats.find(c => c.id === editingTour.combatId);
    if (!combat) return;

    setSavingTour(true);

    try {
      // Préparer les données du tour pour l'API
      const tourData = {
        combatId: editingTour.combatId,
        tourNumber: editingTour.tourNumber,
        contres: editingTour.contres.filter(c => c.texte.trim() !== '').map(contre => ({
          auteur: contre.auteur,
          texte: contre.texte,
          combattant: contre.combattant,
          rolisteId: contre.rolisteId,
          date: new Date().toLocaleDateString('fr-FR'),
          heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        })),
        verdicts: editingTour.verdicts.filter(v => v.texte.trim() !== '').map(verdict => ({
          auteur: verdict.auteur,
          texte: verdict.texte,
          fin: verdict.fin,
          pause: verdict.pause,
          poursuite: verdict.poursuite
        }))
      };

      // Envoyer à l'API
    //   const response = await fetch(API_URL_ADD_TOUR, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(tourData)
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     if (result.ok) {
    //       // Recharger les combats ou mettre à jour localement
    //       await fetchCombats();
          
    //       // Mettre à jour le combat sélectionné
    //       if (selectedCombat && selectedCombat.id === editingTour.combatId) {
    //         const updatedCombat = combats.find(c => c.id === editingTour.combatId);
    //         if (updatedCombat) {
    //           setSelectedCombat(updatedCombat);
    //         }
    //       }
          
    //       setEditingTour(null);
    //       alert('Tour ajouté avec succès !');
    //       return;
    //     }
    //   }

      // A supprimer une fois le tour ajouté
      alert('Tour ajouté avec succès !');

      // Fallback local si l'API échoue
      saveTourLocally();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tour:', error);
      // Fallback local en cas d'erreur
      saveTourLocally();
    } finally {
      setSavingTour(false);
    }
  };

  // Fonction de sauvegarde locale en fallback
  const saveTourLocally = () => {
    if (!editingTour) return;

    const combat = combats.find(c => c.id === editingTour.combatId);
    if (!combat) return;

    const now = new Date();
    const date = now.toLocaleDateString('fr-FR');
    const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newTourItems: Tour[] = [];

    // Ajouter les contres
    editingTour.contres.forEach((contre, index) => {
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

    // Ajouter les verdicts
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

    // Mettre à jour le combat
    const updatedCombats = combats.map(c => {
      if (c.id === editingTour.combatId) {
        return {
          ...c,
          deroulement: [...c.deroulement, ...newTourItems]
        };
      }
      return c;
    });

    saveCombats(updatedCombats);
    setEditingTour(null);

    // Mettre à jour le combat sélectionné
    if (selectedCombat && selectedCombat.id === editingTour.combatId) {
      const updatedSelectedCombat = updatedCombats.find(c => c.id === editingTour.combatId);
      if (updatedSelectedCombat) {
        setSelectedCombat(updatedSelectedCombat);
      }
    }
  };

  // Fonction pour annuler l'édition du tour
  const cancelTourEditing = () => {
    setEditingTour(null);
  };

  // État pour le formulaire de création/édition
  const [formData, setFormData] = useState<Partial<Combat>>({
    arbitre: {
      presence: false,
      principal: { idArbitre: '', nom: '', pseudo: '' }
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
      dateFin: '',
      lastDate: new Date().toISOString().split('T')[0]
    },
    deroulement: []
  });


  // Récupérer l'ID du combat depuis l'URL
  const searchParams = useSearchParams();
  const combatIdFromUrl = searchParams.get('id');

  // Charger automatiquement le combat sélectionné si un ID est présent dans l'URL
  useEffect(() => {
    if (combatIdFromUrl && combats.length > 0) {
      const combat = combats.find(c => c.id === combatIdFromUrl);
      if (combat) {
        openCombatDetails(combat);
      }
    }
    // Charger les combats au montage
    fetchCombats();
  }, [combatIdFromUrl, combats]);

  // Fonction pour charger les combats
  const fetchCombats = async () => {
    setLoading(true);
    // try {
    //   const response = await fetch(API_URL_COMBATS);
    //   if (response.ok) {
    //     const data = await response.json();
    //     if (data.ok && Array.isArray(data.liste)) {
    //       const combatsFromAPI = data.liste.map((combat: any) => convertApiCombatToLocal(combat));
    //       setCombats(combatsFromAPI);
    //       localStorage.setItem('combats', JSON.stringify(combatsFromAPI));
    //       setLoading(false);
    //       return;
    //     }
    //   }
    // } catch (error) {
    //   console.log('API non disponible, utilisation des données locales');
    // }
    const deroulementCombatsRecup = contenuCombatsNinja.filter((contenuCombat: any) => contenuCombat.fight_id === combatIdFromUrl);
    const combatRecup = contenuCombatsNinja.filter((combat: any) => combat.fight_id === combatIdFromUrl);

    const combatsFromAPI = combatRecup.map((combat: any) => convertApiCombatToLocal(combat, deroulementCombatsRecup));
    setCombats(combatsFromAPI);
    localStorage.setItem('combats', JSON.stringify(combatsFromAPI));
    setLoading(false);

    // Fallback : charger depuis localStorage ou créer des exemples
    const savedCombats = localStorage.getItem('combats');
    if (savedCombats) {
      setCombats(JSON.parse(savedCombats));
    } else {
      const exemples: Combat[] = [
        {
          id: '1',
          arbitre: {
            presence: true,
            principal: { idArbitre: '1', nom: 'Darl Vinsmoke', pseudo: 'Darl' }
          },
          combattants: [
            {
              solo: true,
              roliste: 'Amen',
              rolisteRemplacement: false,
              rolisteRemplace: '',
              clan: 'Chinoike',
              nom: 'Hikari',
              image: '/images/combats/hikari.jpg',
              idPersonnage: 'hikari_1',
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
              roliste: 'Rik',
              rolisteRemplacement: false,
              rolisteRemplace: '',
              clan: 'Uchiha',
              nom: 'Tagar',
              image: '/images/combats/tagar.jpg',
              idPersonnage: 'tagar_1',
              clan2: '',
              nom2: '',
              image2: '',
              idPersonnage2: '',
              vainqueur: false,
              perdant: true,
              nul: false
            }
          ],
          contexte: {
            description: 'Combat entre Hikari Chinoike et Tagar Uchiha',
            latence: { presence: false, delai: 0, typeLatence: 'min' }
          },
          situation: {
            fin: true,
            dateDebut: '2024-05-01',
            dateFin: '2024-05-04',
            lastDate: '2024-05-04'
          },
          deroulement: []
        }
      ];
      setCombats(exemples);
      localStorage.setItem('combats', JSON.stringify(exemples));
    }
    setLoading(false);
  };

  // Convertir les données de l'API au format local
  const convertApiCombatToLocal2 = (apiCombat: any): Combat => {
    return {
      id: apiCombat.id || apiCombat._id || Date.now().toString(),
      arbitre: {
        presence: apiCombat.arbitre?.presence || false,
        principal: apiCombat.arbitre?.principal || { idArbitre: '', nom: '', pseudo: '' }
      },
      combattants: apiCombat.combattants || [
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
        description: apiCombat.contexte?.description || '',
        latence: apiCombat.contexte?.latence || { presence: false, delai: 0, typeLatence: 'min' }
      },
      situation: {
        fin: apiCombat.situation?.fin || false,
        dateDebut: apiCombat.situation?.dateDebut || new Date().toISOString().split('T')[0],
        dateFin: apiCombat.situation?.dateFin || '',
        lastDate: apiCombat.situation?.lastDate || new Date().toISOString().split('T')[0]
      },
      deroulement: apiCombat.deroulement || []
    };
  };

  const convertApiCombatToLocal = (apiCombat: any, contenu: any): Combat => {
    // Préparation des données de déroulement à partir du contenu récupéré
    const deroulement = contenu.map((pave: any) => ({
      tour: pave.tour || 1,
      arbitre: false,
      auteur: pave.sender,
      contre: {
        date: pave.date,
        heure: pave.time,
        combattant: pave.author,
        reactions: { like: 0, dislike: 0, surpris: 0, triste: 0, drole: 0 },
        image: '',
        texte: pave.message
      }
    }));

    return {
      id: apiCombat.fight_id || Date.now().toString(),
      arbitre: {
        presence: false,
        principal: { idArbitre: 'arbitre', nom: apiCombat.arbitre || '', pseudo: apiCombat.arbitre || 'Arbitre' }
      },
      combattants: [
        {
          solo: true,
          roliste: '',
          rolisteRemplacement: false,
          rolisteRemplace: '',
          clan: '',
          nom: apiCombat.combattant_1 || '',
          image: '',
          idPersonnage: '',
          clan2: '',
          nom2: '',
          image2: '',
          idPersonnage2: '',
          vainqueur: apiCombat.win !== 'inconnu' && apiCombat.win === apiCombat.combattant_1 ? apiCombat.win : '',
          perdant: apiCombat.lose !== 'inconnu' && apiCombat.lose === apiCombat.combattant_1 ? apiCombat.lose : '',
          nul: apiCombat.win === 'aucun' ? true : false
        },
        {
          solo: true,
          roliste: '',
          rolisteRemplacement: false,
          rolisteRemplace: '',
          clan: '',
          nom: apiCombat.combattant_2 || '',
          image: '',
          idPersonnage: '',
          clan2: '',
          nom2: '',
          image2: '',
          idPersonnage2: '',
          vainqueur: apiCombat.win !== 'inconnu' && apiCombat.win === apiCombat.combattant_2 ? apiCombat.win : '',
          perdant: apiCombat.lose !== 'inconnu' && apiCombat.lose === apiCombat.combattant_2 ? apiCombat.lose : '',
          nul: apiCombat.win === 'aucun' ? true : false
        },
        {
          solo: true,
          roliste: '',
          rolisteRemplacement: false,
          rolisteRemplace: '',
          clan: '',
          nom: apiCombat.combattant_3 || '',
          image: '',
          idPersonnage: '',
          clan2: '',
          nom2: '',
          image2: '',
          idPersonnage2: '',
          vainqueur: apiCombat.win !== 'inconnu' && apiCombat.win === apiCombat.combattant_3 ? apiCombat.win : '',
          perdant: apiCombat.lose !== 'inconnu' && apiCombat.lose === apiCombat.combattant_3 ? apiCombat.lose : '',
          nul: apiCombat.win === 'aucun' ? true : false
        }
      ],
      contexte: {
        description: '',
        latence: { presence: true, delai: 15, typeLatence: 'min' }
      },
      situation: {
        fin: apiCombat.valid_closure ? true : false,
        dateDebut: new Date(apiCombat.start_time).toLocaleDateString('fr-FR'),
        dateFin: new Date(apiCombat.end_time).toLocaleDateString('fr-FR'),
        lastDate: new Date(apiCombat.end_time).toLocaleDateString('fr-FR')
      },
      deroulement: deroulement || []
    };
  };

  // Récupérer les pavés d'un combat depuis l'API
  const fetchPaves = async (combatId: string) => {
    setLoadingPaves(true);
    try {
      const response = await fetch(`${API_URL_PAVES}/${combatId}`);
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

  // Ouvrir les détails d'un combat et charger ses pavés
  const openCombatDetails = async (combat: Combat) => {
    setSelectedCombat(combat);
    await fetchPaves(combat.id);
  };

  // Sauvegarder les combats
  const saveCombats = (newCombats: Combat[]) => {
    setCombats(newCombats);
    localStorage.setItem('combats', JSON.stringify(newCombats));
  };

  // Créer un nouveau combat
  const createCombat = async () => {
    try {
    //   const response = await fetch(API_URL_CREATE_COMBAT, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     if (result.ok) {
    //       await fetchCombats();
    //       resetForm();
    //       alert('Combat créé avec succès !');
    //       return;
    //     }
    //   }
        alert('Combat créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }

    // Fallback local
    const { id: _, ...formDataWithoutId } = formData;
    const newCombat: Combat = {
    //   id: Date.now().toString(),
      ...formDataWithoutId as Combat
    };
    saveCombats([...combats, newCombat]);
    resetForm();
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      arbitre: { presence: false, principal: { idArbitre: '', nom: '', pseudo: '' } },
      combattants: [
        { solo: true, roliste: '', rolisteRemplacement: false, rolisteRemplace: '', clan: '', nom: '', image: '', idPersonnage: '', clan2: '', nom2: '', image2: '', idPersonnage2: '', vainqueur: false, perdant: false, nul: false },
        { solo: true, roliste: '', rolisteRemplacement: false, rolisteRemplace: '', clan: '', nom: '', image: '', idPersonnage: '', clan2: '', nom2: '', image2: '', idPersonnage2: '', vainqueur: false, perdant: false, nul: false }
      ],
      contexte: { description: '', latence: { presence: false, delai: 0, typeLatence: 'min' } },
      situation: { fin: false, dateDebut: new Date().toISOString().split('T')[0], dateFin: '', lastDate: new Date().toISOString().split('T')[0] },
      deroulement: []
    });
    setShowForm(false);
  };

  // Éditer un combat
  const editCombat = (combat: Combat) => {
    setEditingCombat(combat);
    setFormData(combat);
    setIsEditing(true);
    setShowForm(true);
  };

  // Sauvegarder les modifications
  const saveEdit = async () => {
    if (!editingCombat) return;

    // try {
    //   const response = await fetch(`${API_URL_UPDATE_COMBAT}/${editingCombat.id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     if (result.ok) {
    //       await fetchCombats();
    //       setIsEditing(false);
    //       setEditingCombat(null);
    //       setShowForm(false);
    //       alert('Combat mis à jour avec succès !');
    //       return;
    //     }
    //   }
    // } catch (error) {
    //   console.error('Erreur lors de la mise à jour:', error);
    // }

    // Fallback local
    const { id: _, ...formDataWithoutId } = formData;
    const updatedCombats = combats.map(c => c.id === editingCombat.id ? { ...formDataWithoutId, id: editingCombat.id } as Combat : c);
    saveCombats(updatedCombats);
    setIsEditing(false);
    setEditingCombat(null);
    setShowForm(false);
  };

  // Supprimer un combat
  const deleteCombat = async (combatId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce combat ?')) return;

    try {
    //   const response = await fetch(`${API_URL_DELETE_COMBAT}/${combatId}`, {
    //     method: 'DELETE'
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     if (result.ok) {
    //       await fetchCombats();
    //       alert('Combat supprimé avec succès !');
    //       return;
    //     }
    //   }
        alert('Combat supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }

    // Fallback local
    const updatedCombats = combats.filter(c => c.id !== combatId);
    saveCombats(updatedCombats);
  };

  // Ajouter un tour à un combat
  const addTour = (combatId: string) => {
    startEditingTour(combatId);
  };

  // Modifier un tour
  const updateTour = (combatId: string, tourIndex: number, updatedTour: Tour) => {
    const updatedCombats = combats.map(combat => {
      if (combat.id === combatId) {
        const newDeroulement = [...combat.deroulement];
        newDeroulement[tourIndex] = updatedTour;
        return { ...combat, deroulement: newDeroulement };
      }
      return combat;
    });
    saveCombats(updatedCombats);
  };

  // Supprimer un tour
  const deleteTour = (combatId: string, tourIndex: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tour ?')) return;
    
    const updatedCombats = combats.map(combat => {
      if (combat.id === combatId) {
        const newDeroulement = combat.deroulement.filter((_, index) => index !== tourIndex);
        return { ...combat, deroulement: newDeroulement };
      }
      return combat;
    });
    saveCombats(updatedCombats);
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gradient-to-br from-gray-900 to-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Chargement des combats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-300 mb-4">Gestion des Combats 1vs1</h1>
          <p className="text-gray-400">Créez et gérez vos combats RP avec ou sans arbitre</p>
        </div>

        {/* Bouton Nouveau Combat */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Combat</span>
          </button>
        </div>

        {/* Liste des Combats */}
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
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCombat(combat.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
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
                    {combat.situation?.dateDebut ? new Date(combat.situation.dateDebut).toLocaleDateString('fr-FR') : 'Date début'} - 
                    {combat.situation?.dateFin ? new Date(combat.situation.dateFin).toLocaleDateString('fr-FR') : 'En cours'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{combat.deroulement?.length || 0} tour{(combat.deroulement?.length || 0) > 1 ? 's' : ''}</span>
                </div>
                {combat.arbitre?.presence && (
                  <div className="text-sm text-yellow-400">
                    ⚖️ Arbitre: {combat.arbitre.principal?.nom || 'Non défini'}
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
                  onClick={() => addTour(combat.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                  disabled={editingTour !== null}
                >
                  + Tour
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Formulaire de création/édition */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {isEditing ? 'Modifier le Combat' : 'Nouveau Combat'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setIsEditing(false);
                      setEditingCombat(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Formulaire */}
                <div className="space-y-6">
                  {/* Arbitre */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Présence d'un arbitre</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.arbitre?.presence}
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
                          placeholder="Nom de l'arbitre"
                          value={formData.arbitre.principal?.nom || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            arbitre: {
                              ...formData.arbitre!,
                              principal: { ...formData.arbitre!.principal!, nom: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <input
                          type="text"
                          placeholder="Pseudo de l'arbitre"
                          value={formData.arbitre.principal?.pseudo || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            arbitre: {
                              ...formData.arbitre!,
                              principal: { ...formData.arbitre!.principal!, pseudo: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Combattants */}
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
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contexte */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Description du contexte</label>
                    <textarea
                      placeholder="Décrivez le contexte du combat..."
                      value={formData.contexte?.description || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contexte: { ...formData.contexte!, description: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
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

                  {/* Boutons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={isEditing ? saveEdit : createCombat}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition-colors"
                    >
                      {isEditing ? 'Sauvegarder' : 'Créer le Combat'}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setIsEditing(false);
                        setEditingCombat(null);
                      }}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de détails du combat */}
        <AnimatePresence>
          {selectedCombat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
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
                        <p><span className="font-medium">Arbitre :</span> {selectedCombat.arbitre?.presence ? 'Oui' : 'Non'}</p>
                        {selectedCombat.arbitre?.presence && (
                          <p><span className="font-medium">Nom :</span> {selectedCombat.arbitre.principal?.nom}</p>
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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-blue-300">Déroulement</h3>
                      <div className="flex space-x-2">
                        {loadingPaves && (
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            <span>Chargement...</span>
                          </div>
                        )}
                        <button
                          onClick={() => addTour(selectedCombat.id)}
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
                        {Array.from(new Set(selectedCombat.deroulement.map(t => t.tour))).map((tourNumber) => {
                          const tourItems = selectedCombat.deroulement.filter(t => t.tour === tourNumber);
                          return (
                            <div key={tourNumber} className="bg-gray-700 p-4 rounded">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-medium text-yellow-300">Tour {tourNumber}</h4>
                                <button
                                  onClick={() => deleteTour(selectedCombat.id, tourNumber - 1)}
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
                                  );
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

        {/* Modal d'édition de tour */}
        <AnimatePresence>
          {editingTour && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
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
                              {/* Sélection du combattant */}
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
                              
                              {/* Texte du contre */}
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
                              {/* Texte du verdict */}
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
                              
                              {/* Options du verdict */}
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
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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