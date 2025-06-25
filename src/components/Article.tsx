// Importation des dépendances
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Check, Star, Zap, Shield } from 'lucide-react';

// Composant Article
export type Article = {
  id: number;
  titre: string;
  description: string;
  prix: number;
  stock: number;
  rarity: string;
  rating: number;
  // Ajoutez d'autres propriétés si nécessaire
};

type ArticleCardProps = {
  article: Article;
  onAddToCart: (article: Article & { quantite: number }) => void;
};

export function ArticleCard({ article, onAddToCart }: ArticleCardProps) {
  const [quantite, setQuantite] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart({ ...article, quantite });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Légendaire': return 'from-yellow-400 to-orange-500';
      case 'Épique': return 'from-purple-400 to-pink-500';
      case 'Rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-neutral-800">
      {/* Badge de rareté */}
      <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(article.rarity)}`}>
        {article.rarity}
      </div>
      
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
        <div className="text-6xl opacity-20">🥷</div>
        <div className="absolute bottom-2 left-2 flex items-center text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium ml-1">{article.rating}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-sky-200 mb-2">{article.titre}</h3>
        <p className="text-white text-sm mb-3 line-clamp-2">{article.description}</p>
        
        {/* Stock */}
        <div className="flex items-center mb-3">
          <span className="text-xs text-gray-500">Stock: </span>
          <span className={`text-xs font-medium ml-1 ${article.stock < 5 ? 'text-red-400' : 'text-green-500'}`}>
            {article.stock} disponible{article.stock > 1 ? 's' : ''}
          </span>
        </div>

        {/* Contrôles quantité */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setQuantite(Math.max(1, quantite - 1))}
              className="w-8 h-8 rounded-full bg-gray-600 hover:bg-blue-500 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium text-lg text-gray-400 w-8 text-center">{quantite}</span>
            <button 
              onClick={() => setQuantite(Math.min(article.stock, quantite + 1))}
              className="w-8 h-8 rounded-full bg-gray-600 hover:bg-blue-500 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{article.prix} ¥</div>
          </div>
        </div>

        {/* Bouton d'achat */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding || article.stock === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            isAdding 
              ? 'bg-green-500 text-white' 
              : article.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-blue-600 hover:to-blue-600 text-white transform hover:scale-105'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-5 h-5" />
              <span>Ajouté !</span>
            </>
          ) : article.stock === 0 ? (
            <span>Rupture de stock</span>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Ajouter au panier</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}