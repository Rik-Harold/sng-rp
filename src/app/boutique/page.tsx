'use client'

// Importation des dépendances
import { useState, useEffect } from "react"
import { ShoppingCart } from 'lucide-react'

// Importation de composants
import { ArticleCard } from "@/components/Article"
import { PanierNinja } from "@/components/PanierNinja"

// Données des articles avec plus de détails
// const articlesNinja = [ ... ];

const API_URL_LOCAL = "http://localhost:3001/sng/liste/article";
const API_URL = "https://datarikbook-api.vercel.app/sng/liste/article";

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

type Article = {
  id: number;
  titre: string;
  description: string;
  prix: number;
  stock: number;
  rarity: string;
  rating: number;
  image?: string;
  categorie?: string;
  dispo?: boolean;
};

export default function BoutiqueGroupe() {
  const [articlesNinja, setArticlesNinja] = useState<Article[]>([]);
  const [panier, setPanier] = useState<PanierItem[]>([]);
  const [isPanierOpen, setIsPanierOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Tous');
  const whatsappNumber = '33615641467'; // Remplace par ton numéro sans +

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (data.ok && Array.isArray(data.liste)) {
          setArticlesNinja(
            data.liste.map((a: any) => ({
              id: a.id,
              titre: a.name.charAt(0).toUpperCase() + a.name.slice(1),
              description: a.categorie ? `Catégorie : ${a.categorie}` : '',
              prix: a.prix,
              stock: a.illimite ? 99 : (a.quantite?.valeur ?? 0),
              rarity: a.prix >= 500 ? 'Légendaire' : a.prix >= 200 ? 'Épique' : a.illimite ? 'Commun' : a.quantite.valeur > 1 ? 'Rare' : a.quantite.valeur > 3 ? 'Épique' : a.quantite.valeur > 0 ? 'Légendaire' : 'Commun',
              rating: 4.5, // Valeur par défaut, à ajuster si dispo
              image: a.image ? `/images/articles/${a.image}` : undefined,
              categorie: a.categorie,
              dispo: a.dispo,
            }))
          );
        }
      });
  }, []);

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
    // Générer le récapitulatif
    const recap = panier.map(item => `${item.titre} x${item.quantite} - ${item.prix * item.quantite}¥`).join('%0A');
    const total = panier.reduce((sum, item) => sum + item.prix * item.quantite, 0);
    const message = `Bonjour, je viens de faire un achat sur la boutique SNG :%0A${recap}%0ATotal : ${total}¥`;
    setPanier([]);
    setIsPanierOpen(false);
    // Redirection WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const filteredArticles = articlesNinja.filter((article: Article) => {
    const matchesSearch = article.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Tous' || article.categorie === filter;
    return matchesSearch && matchesFilter;
  });

  const handleShowRarity = (article: Article) => {
    console.log('Rareté de l\'article:', article.rarity);
  };

  const categories = ['Tous', ...new Set(articlesNinja.map((article: Article) => article.categorie ))];
  const totalItems = panier.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <div className="pt-24 pb-12">
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          {/* Titre et bouton du panier */}
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
              className="flex-1 px-4 py-2 rounded-lg text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-border-dark"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-border-dark"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Tous'}</option>
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
              onShowRarity={handleShowRarity}
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