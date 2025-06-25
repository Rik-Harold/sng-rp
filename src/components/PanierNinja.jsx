// Importation des dépendances
import React, { useState } from 'react';
import { ShoppingCart, X, Minus, Plus, Zap, Check, Shield } from 'lucide-react';

// Composant Panier amélioré
export function PanierNinja({ panier, isOpen, onClose, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutStep(1);
    
    // Simulation du processus de paiement
    setTimeout(() => setCheckoutStep(2), 1500);
    setTimeout(() => setCheckoutStep(3), 3000);
    setTimeout(() => {
      setCheckoutStep(0);
      setIsCheckingOut(false);
      onCheckout();
    }, 4500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Panier Ninja</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:text-gray-500 hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {panier.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Votre panier est vide</p>
              <p className="text-gray-400">Ajoutez des articles ninja pour commencer !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {panier.map((item, index) => (
                <div key={index} className="flex flex-wrap items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center text-2xl">
                    🥷
                  </div>
                  <div className="flex-1 min-w-[166px]">
                    <h4 className="font-semibold text-gray-800">{item.titre}</h4>
                    <p className="text-sm text-gray-600">{item.prix} ¥ × {item.quantite}</p>
                  </div>
                  <div className="flex items-center text-gray-600 space-x-2">
                    <button 
                      // onClick={() => onUpdateQuantity(item.id, item.quantite - 1)}
                      onClick={() => onUpdateQuantity(item.titre, item.quantite - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantite}</span>
                    <button 
                      // onClick={() => onUpdateQuantity(item.id, item.quantite + 1)}
                      onClick={() => onUpdateQuantity(item.titre, item.quantite + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-orange-400">{item.prix * item.quantite} ¥</div>
                    <button 
                      onClick={() => onRemoveItem(item.titre)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec total et checkout */}
        {panier.length > 0 && (
          <div className="border-t bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-500">Total:</span>
              <span className="text-3xl font-bold text-orange-600">{total} ¥</span>
            </div>
            
            {!isCheckingOut ? (
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Procéder au paiement</span>
              </button>
            ) : (
              <div className="text-center py-4">
                {checkoutStep === 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    <span>Connexion au wallet TipLink...</span>
                  </div>
                )}
                {checkoutStep === 2 && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <Shield className="w-6 h-6" />
                    <span>Traitement du paiement Solana...</span>
                  </div>
                )}
                {checkoutStep === 3 && (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Check className="w-6 h-6" />
                    <span>Paiement confirmé ! Merci ninja !</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}