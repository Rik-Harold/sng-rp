// Importation des dépendances
import React, { useState } from 'react';
import Image from 'next/image'
import { motion } from 'framer-motion';
import { Star, EyeIcon } from 'lucide-react';
import Link from 'next/link';

// Composant de carte de combat
type Fight = {
  fight_id: number;
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
type FightCardProps = {
  fight: Fight;
  arene: Number
};

// Fonction utilitaire pour capitaliser les textes
const capitalizeText = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const terrains = [
  {
    id: 1,
    nom: 'Arena 1',
    image: 'https://i.pinimg.com/736x/a1/98/91/a1989175ff90f9580c10141b284469ce.jpg'
  },
  {
    id: 2,
    nom: 'Arena 2',
    image: 'https://i.pinimg.com/736x/b2/9d/f5/b29df5edeb6e8d439bd42b550a56a8d0.jpg'
  },
  {
    id: 3,
    nom: 'Arena 3',
    image: 'https://i.pinimg.com/736x/a8/84/68/a88468c4925c7e7e2e41a9caef2edfee.jpg'
  }
]

const details = {
    combattants: [
        {
            nom: "Ryusuki",
            image: "https://i.pinimg.com/736x/f5/58/73/f558736d6a147e444bfe18026a92f413.jpg"
        },
        {
            nom: "Shinji",
            image: "https://i.pinimg.com/736x/c9/9b/4a/c99b4a74540467050554d308fd1e446d.jpg"
        }
    ]
}

export function FightCard({ fight, arene }: FightCardProps) {
  // Fond dynamique selon le terrain
  const terrainImg = terrains.find(terrain => terrain.nom.toLowerCase() === fight.arena.toLowerCase())?.image

  return (
    <div className="relative bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-neutral-800">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
        {terrainImg && (
          <Image
            src={terrainImg as string}
            alt="Terrain de combat"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
        <div className="absolute bottom-2 left-4 text-white font-bold text-lg drop-shadow-lg">{capitalizeText(fight.arena)}</div>
        <div className="absolute bottom-2 right-2 flex items-center text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium ml-1">{fight.message_count}</span>
        </div>
      </div>

      {/* Header immersif avec avatars */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
          <div className="relative">
            <Image src={details.combattants[0].image} alt={fight.combattant_1} width={72} height={72} className="rounded-full border-4 border-blue-500 shadow-xl ring-2 ring-blue-300" />
            <span className="absolute -inset-2 rounded-full border-2 border-blue-400 animate-pulse pointer-events-none"></span>
          </div>
          <span className="text-blue-300 font-bold mt-1 text-sm drop-shadow">{capitalizeText(fight.combattant_1)}</span>
        </motion.div>
        <span className="text-3xl font-extrabold text-white drop-shadow-lg">VS</span>
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
          <div className="relative">
            <Image src={details.combattants[1].image} alt={fight.combattant_2} width={72} height={72} className="rounded-full border-4 border-red-500 shadow-xl ring-2 ring-red-300" />
            <span className="absolute -inset-2 rounded-full border-2 border-red-400 animate-pulse pointer-events-none"></span>
          </div>
          <span className="text-red-300 font-bold mt-1 text-sm drop-shadow">{capitalizeText(fight.combattant_2)}</span>
        </motion.div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-sky-200 mb-2">Modérateur : {capitalizeText(fight.arbitre)}</h3>
        <div className="text-xs text-gray-400 mb-2">
          Début : {new Date(fight.start_time).toLocaleDateString('fr-FR')} à {new Date(fight.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}<br />
          Fin : {new Date(fight.end_time).toLocaleDateString('fr-FR')} à {new Date(fight.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {/* Verdict */}
        <div className="flex items-center justify-center mb-3">
          {/* <span className="text-xs text-gray-500">Combat inachevé</span> */}
          <span className={`text-xs font-medium ml-1 ${fight.result_type === 'inconnu' ? 'text-red-400' : 'text-green-500'}`}>
            {fight.result_type === 'victoire' ? `Victoire de ${capitalizeText(fight.win)}` : fight.result_type === 'nullité' ? `Combat nul` : `
            Combat interrompu`}
          </span>
        </div>

        {/* Bouton de consultation du combat */}
        <Link href={`/arene/combat?id=${fight.fight_id}&arene=${arene}`} // Remplace par l'ID réel du combat
         className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-blue-600 hover:to-blue-600 text-white transform hover:scale-105`}
        >
            <>
              <EyeIcon className="w-5 h-5" />
              <span>Consulter le combat</span>
            </>
        </Link>
      </div>
    </div>
  );
}