"use client";

import { motion } from "framer-motion";
import { Search, X, Eye, ExternalLink } from 'lucide-react'; // Ajout de Menu pour la Navbar
import { useState, useEffect, useCallback } from 'react';

// Importation de composants réutilisables
import { capitalizeFirstLetter } from "@/middlewares/formatfunctions";

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

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

// --- COMPOSANT PRINCIPAL DE LA PAGE PERSONNAGES ---

type Character = {
    id?: string | number;
    name: string;
    clan?: string;
    grade?: string;
    village?: string;
    pays?: string;
    roliste: string;
    age?: string | number;
    statut?: string;
    // actif?: boolean;
    mort?: boolean;
    images?: {
        principale?: string;
        toutes?: string[];
    };
};

const API_URL_LOCAL = "http://localhost:3001/sng/liste/avatars/sng";
const API_URL = "https://datarikbook-api.vercel.app/sng/liste/avatars/sng";

export default function CharactersPage() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Récupération des données depuis l'API
    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                // const response = await fetch(API_URL);
                const response = await fetch(API_URL_LOCAL); // Utilisation de l'URL locale pour le développement
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                const data = await response.json();
                if (data.ok && Array.isArray(data.liste)) {
                    setCharacters(data.liste);
                    setFilteredCharacters(data.liste); // Initialise les personnages filtrés avec tous les personnages
                } else {
                    setError('Format de données inattendu.' as string);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des personnages:", err);
                setError('Impossible de charger les personnages. Veuillez réessayer plus tard.' as string);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    // Logique de filtrage des personnages
    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = characters.filter((char: Character) =>
            char.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            (char.clan && char.clan.toLowerCase().includes(lowerCaseSearchTerm) && char.clan !== 'inconnu') ||
            (char.grade && char.grade.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (char.village && char.village.toLowerCase().includes(lowerCaseSearchTerm))
        );
        setFilteredCharacters(filtered);
    }, [searchTerm, characters]);

    // Ouvre le modal avec les détails du personnage sélectionné
    const openModal = useCallback((character: Character) => {
        setSelectedCharacter(character);
        document.body.style.overflow = 'hidden'; // Empêche le défilement du corps
    }, []);

    // Ferme le modal
    const closeModal = useCallback(() => {
        setSelectedCharacter(null);
        document.body.style.overflow = 'unset'; // Réactive le défilement du corps
    }, []);

    if (loading) {
        return (
            <div className="bg-dark-bg text-text-light min-h-screen flex justify-center items-center font-sans">
                Chargement des personnages...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-dark-bg text-text-light min-h-screen flex justify-center items-center font-sans text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-dark-bg text-text-light font-sans overflow-x-hidden pt-24 pb-12">
            <main>
                <Section
                    id="characters-list"
                    title="Découvrez les Ninjas"
                    description="Explorez la liste complète des personnages de notre communauté. Utilisez les filtres pour trouver votre ninja préféré."
                >
                    {/* Zone de filtre */}
                    <motion.div
                        className="bg-dark-card p-6 rounded-lg mb-12 shadow-lg max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="flex items-center border border-border-dark rounded-full px-4 py-2 bg-dark-bg focus-within:border-orange-primary transition-all">
                            <Search className="text-text-secondary mr-3" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, clan, grade ou village..."
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
                    </motion.div>

                    {/* Liste des personnages */}
                    {filteredCharacters.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center"
                            variants={cardContainerVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {filteredCharacters.map((char: Character) => (
                                <motion.div
                                    key={char.name} // Utilise l'ID si disponible, sinon un combo unique
                                    className="bg-dark-card p-6 rounded-xl border border-border-dark text-center flex flex-col items-center shadow-lg hover:shadow-orange-primary/20 transition-all duration-300"
                                    variants={cardVariants}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    <div className="relative w-40 h-40 mb-4">
                                        <img // Remplacement de Image par img
                                            src={`/avatars/profil/${char.images?.principale || 'ninja.png'}`} // Chemin local pour les images d'avatars
                                            alt={`Avatar de ${char.name}`}
                                            className="w-full h-full object-cover rounded-full border-4 border-orange-primary" // Ajout de classes pour simuler layout="fill" objectFit="cover"
                                            onError={(e) => {
                                                e.currentTarget.src = '/avatars/profil/ninja.png'; // Image par défaut en cas d'erreur
                                            }}
                                        />
                                    </div>
                                    <h3 className="font-bold text-xl mb-1 text-text-light">{capitalizeFirstLetter(char.name)}</h3>
                                    {char.clan && char.clan !== 'inconnu' && (
                                        <p className="text-sm text-text-secondary mb-1">Clan: <span className="text-orange-primary font-medium">{capitalizeFirstLetter(char.clan)}</span></p>
                                    )}
                                    <p className="text-sm text-text-secondary mb-1">Grade: <span className="text-text-light">{capitalizeFirstLetter(char.grade ?? '')}</span></p>
                                    <p className="text-sm text-text-secondary mb-4">Rôliste: <span className="text-text-light">{capitalizeFirstLetter(char.roliste)}</span></p>

                                    <div className="flex space-x-3 mt-auto w-full justify-center">
                                        <button
                                            onClick={() => openModal(char)}
                                            className="bg-orange-primary text-white p-3 rounded-full hover:bg-orange-hover transition-colors shadow-md"
                                            aria-label={`Voir les détails de ${char.name}`}
                                        >
                                            <Eye size={20} />
                                        </button>
                                        <a // Remplacement de Link par a
                                            href={`/personnages/${encodeURIComponent(char.roliste.toLowerCase().replace(/\s+/g, '-'))}`}
                                            className="bg-gray-700 text-text-light p-3 rounded-full hover:bg-gray-600 transition-colors shadow-md"
                                            aria-label={`Aller à la page de ${char.roliste}`}
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-text-secondary text-lg mt-8"
                        >
                            Aucun personnage ne correspond à votre recherche.
                        </motion.p>
                    )}
                </Section>
            </main>

            {/* Modal pour les détails du personnage */}
            {selectedCharacter && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal} // Ferme le modal si on clique en dehors du contenu
                >
                    <motion.div
                        className="bg-dark-card p-8 rounded-lg shadow-2xl max-w-lg w-full relative border border-border-dark transform scale-95"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic pour ne pas fermer le modal
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-text-secondary hover:text-orange-primary transition-colors"
                            aria-label="Fermer le modal"
                        >
                            <X size={28} />
                        </button>
                        <h2 className="text-3xl font-bold text-orange-primary mb-4 text-center">{selectedCharacter?.name.charAt(0).toUpperCase() + selectedCharacter?.name.slice(1)}</h2>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="relative w-48 h-48 flex-shrink-0">
                                <img // Remplacement de Image par img
                                    src={`/avatars/profil/${selectedCharacter?.images?.principale || 'ninja.png'}`}
                                    alt={`Image principale de ${selectedCharacter.name}`}
                                    className="w-full h-full object-cover rounded-lg border-4 border-orange-primary" // Ajout de classes pour simuler layout="fill" objectFit="cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/avatars/profil/ninja.png';
                                    }}
                                />
                            </div>
                            <div className="text-left flex-grow">
                                <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Rôliste:</span> {capitalizeFirstLetter(selectedCharacter?.roliste)}</p>
                                {selectedCharacter?.clan && selectedCharacter.clan !== 'inconnu' && (
                                    <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Clan:</span> {capitalizeFirstLetter(selectedCharacter.clan)}</p>
                                )}
                                <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Pays:</span> {capitalizeFirstLetter(selectedCharacter?.pays ?? '')}</p>
                                <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Village:</span> {capitalizeFirstLetter(selectedCharacter?.village ?? '')}</p>
                                <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Âge:</span> {selectedCharacter.age} ans</p>
                                <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Grade:</span> {capitalizeFirstLetter(selectedCharacter.grade ?? '')}</p>
                                <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Statut:</span> {capitalizeFirstLetter(selectedCharacter.statut ?? '')}</p>
                                {/* <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Actif:</span> {selectedCharacter.actif ? 'Oui' : 'Non'}</p> */}
                                <p className="mb-2 text-text-light"><span className="font-semibold text-orange-primary">Mort:</span> {selectedCharacter.mort ? 'Oui' : 'Non'}</p>
                            </div>
                        </div>
                        {/* Liste des images du personnage */}
                        {selectedCharacter.images?.toutes && selectedCharacter.images.toutes.length > 0 && (
                            <div className="mt-6 border-t border-border-dark pt-4">
                                <h4 className="font-semibold text-lg mb-3 text-orange-primary">Autres images :</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {selectedCharacter.images.toutes.map((img, index) => (
                                        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                                            <img // Remplacement de Image par img
                                                src={`/avatars/profil/${img}`}
                                                alt={`Image additionnelle de ${selectedCharacter.name}`}
                                                className="w-full h-full object-cover rounded-lg border-2 border-gray-600" // Ajout de classes pour simuler layout="fill" objectFit="cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/avatars/profil/ninja.png';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

// --- COMPOSANTS RÉUTILISABLES (COPIÉS DE VOTRE page.tsx POUR LA COHÉRENCE) ---

// Composant générique pour les sections afin d'éviter la répétition de code
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
