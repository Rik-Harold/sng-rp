'use client'

// Importation des dépendances
import { useState } from "react"
import { ShoppingCart } from 'lucide-react'

// Importation de composants
import { ArticleCard, Article } from "@/components/Article"
import { PanierNinja } from "@/components/PanierNinja"

// Données des articles avec plus de détails
const articlesNinja = [
  {
    id: 1,
    titre: 'Shuriken Légendaire',
    description: 'Shuriken tranchant forgé dans l\'acier du Pays du Fer.',
    prix: 25,
    image: '/api/placeholder/200/150',
    categorie: 'Arme',
    rarity: 'Légendaire',
    stock: 12,
    rating: 4.8
  },
  {
    id: 2,
    titre: 'Kunaï d\'Élite',
    description: 'Kunaï utilisé par les ninjas d\'élite, équilibrage parfait',
    prix: 45,
    image: '/api/placeholder/200/150',
    categorie: 'Arme',
    rarity: 'Rare',
    stock: 8,
    rating: 4.6
  },
  {
    id: 3,
    titre: 'Cape Akatsuki',
    description: 'Cape de l\'organisation Akatsuki, nuages rouges brodés',
    prix: 85,
    image: '/api/placeholder/200/150',
    categorie: 'Vêtement',
    rarity: 'Épique',
    stock: 3,
    rating: 4.9
  },
  {
    id: 4,
    titre: 'Katana',
    description: 'Katana traditionnel ninja, lame aiguisée et équilibrée.',
    prix: 15,
    image: '/api/placeholder/200/150',
    categorie: 'Arme',
    rarity: 'Commun',
    stock: 25,
    rating: 4.2
  },
  {
    id: 5,
    titre: 'Masque ANBU',
    description: 'Masque des forces spéciales ANBU de Konoha',
    prix: 120,
    image: '/api/placeholder/200/150',
    categorie: 'Accessoire',
    rarity: 'Légendaire',
    stock: 2,
    rating: 5.0
  },
  {
    id: 6,
    titre: 'Parchemin Explosif',
    description: 'Parchemin explosif utilisé pour des pièges ninja.',
    prix: 35,
    image: '/api/placeholder/200/150',
    categorie: 'Consommable',
    rarity: 'Rare',
    stock: 15,
    rating: 4.4
  }
];

// Mise à disposition de l'entête
type PanierItem = {
  id: number;
  titre: string;
  description: string;
  prix: number;
  image?: string;
  categorie?: string;
  rarity?: string;
  stock?: number;
  rating?: number;
  quantite: number;
};

export default function BoutiqueGroupe() {
  const [panier, setPanier] = useState<PanierItem[]>([]);
  const [isPanierOpen, setIsPanierOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Tous');

  const addToCart = (article: Article & { quantite: number }) => {
    setPanier(prevPanier => {
      const existingItem = prevPanier.find(item => item.id === article.id);
      if (existingItem) {
        return prevPanier.map(item =>
          item.id === article.id
            ? { ...item, quantite: item.quantite + article.quantite }
            : item
        );
      }
      // Ensure all PanierItem fields are present
      const panierItem: PanierItem = {
          ...article,
          id: 0
      };
      return [...prevPanier, panierItem];
    });
  };

  const updateQuantity = (name: string, newQuantity: number) => {
    if (newQuantity <= 0) {
    //   removeFromCart(id);
      removeFromCart(name);
      return;
    }
    setPanier(prevPanier =>
      prevPanier.map(item =>
        // item.id === id ? { ...item, quantite: newQuantity } : item
        item.titre === name ? { ...item, quantite: newQuantity } : item
      )
    );
  };

//   const removeFromCart = (id: number) => {
//     setPanier(prevPanier => prevPanier.filter(item => item.id !== id));
//   };
    const removeFromCart = (name: string) => {
        setPanier(prevPanier => prevPanier.filter(item => item.titre !== name));
    };

  const handleCheckout = () => {
    setPanier([]);
    setIsPanierOpen(false);
  };

  const filteredArticles = articlesNinja.filter(article => {
    const matchesSearch = article.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Tous' || article.categorie === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['Tous', ...new Set(articlesNinja.map(article => article.categorie))];
  const totalItems = panier.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <div className="pt-24 pb-12">
      {/* Header */}
      {/* bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 shadow-lg */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold flex items-center space-x-3">
              <span>Boutique Ninja</span>
            </h1>
            <button 
              onClick={() => setIsPanierOpen(true)}
              className="relative bg-white text-neutral-800 bg-opacity-20 hover:bg-opacity-30 px-6 py-3 cursor-pointer rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Rechercher un article ninja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
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
        </div>
      </div>

      {/* Grille d'articles */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onAddToCart={addToCart}
            />
          ))}
        </div>
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl">Aucun article trouvé</p>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* Composant Panier */}
      <PanierNinja 
        panier={panier}
        isOpen={isPanierOpen}
        onClose={() => setIsPanierOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}