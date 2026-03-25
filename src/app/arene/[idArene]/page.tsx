'use client'
// Importation des dépendances
import React, { useEffect, useRef, useState, ChangeEvent } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X } from 'lucide-react'
import { useSearchParams } from 'next/navigation';

// messages

// Data à exploiter
// import combatsNinja from '@/data/Fight_Arene_3.json';
// import contenuCombatsNinja from '@/data/Messages_Fight_Arene_3.json';


// Fonction utilitaire pour capitaliser les textes
const capitalizeText = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Pour la saisie et l'affichage des contres
type ContreType = {
    id: number;
    auteur: string;
    combattant: string;
    texte: string;
    image: string | null;
    date: string;
    heure: string;
  }

// Déclaration des variables
const combat1vs1SansArbitre = {
  arbitre: {
      presence: false,
      idArbitre: '',
      nom: '',
      pseudo: ''
  },
  combattants: [
      {
          solo: true,
          roliste: 'Amen',
          rolisteRemplacement: false,
          rolisteRemplace: '',
          clan: 'Chinoike',
          nom: 'Hikari',
          image: 'https://i.pinimg.com/736x/f5/58/73/f558736d6a147e444bfe18026a92f413.jpg',
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
          roliste: 'Rik',
          rolisteRemplacement: false,
          rolisteRemplace: '',
          clan: 'Uchiha',
          nom: 'Tagar',
          image: 'https://i.pinimg.com/736x/c9/9b/4a/c99b4a74540467050554d308fd1e446d.jpg',
          idPersonnage: '',
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
      description: '',
      latence: {
          presence: false,
          delai: 0,
          typeLatence: 'min'
      }
  },
  situation: {
      fin: true,
      dateDebut: '01/05/2024',
      dateFin: '04/05/2024',
      lastDate: '04/05/2024'
  },
  deroulement: [
      {
          tour: 1,
          arbitre: false,
          auteur: 'Amen',
          verdict: {
              fin: false,
              pause: false,
              poursuite: true,
              texte: '',
              image: '',
              revendications: [
                  {
                      roliste: '',
                      arbitre: false,
                      combattant: '',
                      texte: ''
                  }
              ]
          },
          contre: {
              date: '20/06/2023',
              heure: '21:36',
              combattant: 'Hikari  Chinoike',
              reactions: {
                  like: 0,
                  dislike: 0,
                  surpris: 0,
                  triste: 0,
                  drole: 0,
              },
              image: '',
              texte: `Un jeune shinobi marche lentement vers son destin......Où pouvait il se trouver actuellement..... 
Le soleil dans son ascension vers le zenith. La rivière s'écoulant inlassablement dans la vallée de la fin sous forme d'une cascade.. 
Hikari Chinoike vêtu de sa cape à capuche se trouvait sur la tête d'une statue particulière... représentant Hashirama Senju le premier Hokage de Konoha..... Dans son excursion vers le pays du feu il était passé par cet endroit mythique.. Sa mission était simple....
Partir à konoha en quête des Uchiha. Animé par la flamme de la vengeance contre ce clan qui avait exterminé le sien...

Le vent secouant sa cape il faisait face soudain à un shinobi qui ressemblait pratiquement de loin au personnage sur lequel il se tenait debout......Madara Uchiha?...
Impossible.. Mais le shinobi devait être de son clan.. Les cheveux, l'allure........

25 m les séparait...
Hikari espérait secrètement que cela soit un Uchiha...
<<Qui es tu ? >> demanda t'il d'une voix forte ? 

Tout en lui parlant Hikari l'observait attentivement à l'affût du moindre mouvement suspect.
Si c'était bien un Uchiha alors il ne tarderait pas à sentir l'animosité de Hikari...

Action en cours`,
              actionCaches: {
                  presence: false,
                  listeTechniques: [
                      {
                          name: '',
                          lien: '',
                          debut: true,
                          enCours: false,
                          fin: false
                      }
                  ],
                  texte: ''
              }
          }
      },
      {
          tour: 1,
          arbitre: false,
          auteur: 'Rik',
          verdict: {
              fin: false,
              pause: false,
              poursuite: true,
              texte: '',
              image: '',
              revendications: [
                  {
                      roliste: '',
                      arbitre: false,
                      combattant: '',
                      texte: ''
                  }
              ]
          },
          contre: {
              date: '20/06/2023',
              heure: '22:15',
              combattant: 'Uchiha Tagar',
              reactions: {
                  like: 0,
                  dislike: 0,
                  surpris: 0,
                  triste: 0,
                  drole: 0,
              },
              image: '',
              texte: `Prenant du bon temps assis sur la tête de la statue de mon ancêtre, j'observais l'horizon.

L'air frais qui se dégageait de ce lieu m'apportait une certaine harmonie. Une sensation reposante qui m'adoucissait l'esprit.

En ce lieu, j'arrivais à ne faire qu'un avec la nature, plongé dans les souvenirs de ce que serait une vie sans histoire.

Une vie loin de toute ces réalités. Une réalité qui ne restera sans doute qu'illusoire. Quelle ironie ! Porter un pouvoir qui interprète clairement son destin...

Dans ce léger sourire qu'arborait mon visage, une présence se fit ressentir. Les yeux sur l'horizon, j'aperçus son regard.

On y voyait de la haine. Ce regard empli de vengeance que j'avais jadis. Le destin ne cessera donc jamais de me faire face. Telle est ma dure réalité.

Me laissant tomber du haut de cette falaise, je me laissais porter par le vent. Le regard dressé sur le jeune homme devant moi, ma descente se stabilisait progressivement.

Mon chakra commençait ainsi à apprivoiser la gravité afin de lui dicter mon point de chute. Quelques secondes s'écoulaient avant que l'impact sur la surface de l'eau n'éclabousse l'horizon.

Le voile des gouttelettes d'eau levées se dissipa et laissait face moi, immobile sur la surface de l'eau, depuis une vingtaine de mètres environ, mon adversaire.

<< Je suis Uchiha Tagar. Que me vaut bien ta présence, étranger... >>`,
              actionCaches: {
                  presence: false,
                  listeTechniques: [
                      {
                          name: '',
                          lien: '',
                          debut: true,
                          enCours: false,
                          fin: false
                      }
                  ],
                  texte: ''
              }
          }
      },
      {
          tour: 2,
          arbitre: false,
          auteur: 'Amen',
          verdict: {
              fin: false,
              pause: false,
              poursuite: true,
              texte: '',
              image: '',
              revendications: [
                  {
                      roliste: '',
                      arbitre: false,
                      combattant: '',
                      texte: ''
                  }
              ]
          },
          contre: {
              date: '20/06/2023',
              heure: '23:15',
              combattant: 'Chinoike Hikari',
              reactions: {
                  like: 0,
                  dislike: 0,
                  surpris: 0,
                  triste: 0,
                  drole: 0,
              },
              image: '',
              texte: `Tandis que le shinobi descendait avec grâce et elegance de la statue de Madara Uchiha, un malaise s'emparait progressivement de Hikari...... Ce chakra... Nul besoin d'entre sensoriel pour percevoir la puissance de cet individu..

Ainsi il se nomme Tagar Uchiha... Est ce l'individu..

Hikari parvient à dominer sa peur, malaxant son chakra et conservant l' équilibre sur l'eau.. 

20 m les séparant.
Je suis Hikari Chinoike. Le nom de mon clan doit te dire quelque chose.. Sinon peu importe j'étais en route pour Konoha pour  venger le clan Chinoike que tes ancêtres ont exterminé. L'existence des Uchiha m'insupporte...


En garde

Sur ces mots Hikari compose rapidement une série de mudras  et garde les mains jointes....  Une seconde suffisante à cela tandis que de l'eau environnante autour de Tagar à 10 m de lui s'élève soudain  une dizaine de puissants jets d'eau sous forme de vague coupantes lancés (30 cm de largeur et 15 m de longueur) l'encerclant en ne lui laissant aucun angle mort de riposte et s'abattant sur lui le perforant et le coupant aussi au passage à la vitesse de 7m/s....

Les mains toujours jointes les iris de Hikari viraient vers le rouge plus sombre qu'ecarlate  tandis que les pupilles ( une seule ligne) prenaient une couleur violette....

Il ne comptait pas perdre de vue la riposte de Tagar et devait avant tout se méfier de ses sharingan.. 

Action en cours.. 
Suiton- Cône du déluge (Version lances de Tobirama vs Hiruzen  grâce à la manipulation de l'eau environnante) 
Ketsuryûgan`,
              actionCaches: {
                  presence: false,
                  listeTechniques: [
                      {
                          name: '',
                          lien: '',
                          debut: true,
                          enCours: false,
                          fin: false
                      }
                  ],
                  texte: ''
              }
          }
      },
      {
          tour: 2,
          arbitre: false,
          auteur: 'Rik',
          verdict: {
              fin: false,
              pause: false,
              poursuite: true,
              texte: '',
              image: '',
              revendications: [
                  {
                      roliste: '',
                      arbitre: false,
                      combattant: '',
                      texte: ''
                  }
              ]
          },
          contre: {
              date: '20/06/2023',
              heure: '23:42',
              combattant: 'Uchiha Tagar',
              reactions: {
                  like: 0,
                  dislike: 0,
                  surpris: 0,
                  triste: 0,
                  drole: 0,
              },
              image: '',
              texte: `Sans crier gare, les hostilités débutèrent. L'aura meurtrière de l'adversaire avait trahi ses intentions. Ses premiers mouvements coïncidaient avec la présence du sharingan aux 3 tomoes dans mes pupilles.

La rapidité de ses mudra donnait une impression sur son talent. Néanmoins, la vision dynamique du sharingan était à mon avantage.

L'eau commençait à être imbibée de chakra et sa densité augmentait au point où j'étais semble t-il, piégé dans son jutsu.

Les lances aqueuses émergèrent mais leur vitesse m'était perceptible. J'anticipais leur trajectoire en sentant leur présence autant dans mon dos qu'au bruit de l'eau autour de moi.

Soudain, l'eau m'aspira !

Trop évident pour y penser mais parfait pour détourner l'attention. Je venais d'arrêter d'emmagasiner du chakra sous mes pieds et me suis ainsi laissé tomber dans l'eau.

La vitesse de mon abaissement avait profité à ma réactivité. J'échappais ainsi à l'entrechoque des lances aqueuses qui se détruisaient entre elles.

Sous l'eau, j'avais donc réussi à m'éclipser en orientant ma descente par le poids de mon corps et cette fois, les vagues répondaient à mon appel.

Un orbe tourbillonnant se formait dans le creux de ma main droite pendant que l'eau tout autour de moi était entraîné dans ces flots impétueux.

La taille de l'orbe avait rapidement augmenté et la pression de l'eau attirait à moi, centre du cyclone, mon adversaire piégé dans les eaux.

Mon Katana était en parallèle dégainé. Sa lame s'imprègne d'une aura blanche qui réagissait à mon chakra quand tout à coup, je m'élevais tiré par la lame.

Sorti de l'eau telle une flèche et en hauteur d'une dizaine de mètres environ, un mudra était maintenu dans ma main droite qui plus tôt, avait servi à former l'Orbe tourbillonnant.

Regard fixé sur l'adversaire, j'observais avec prudence sa réaction suite à ma contre-attaque.

Rasengan 👣
Katana volant 👣
Ac 👣`,
              actionCaches: {
                  presence: false,
                  listeTechniques: [
                      {
                          name: '',
                          lien: '',
                          debut: true,
                          enCours: false,
                          fin: false
                      }
                  ],
                  texte: ''
              }
          }
      },
      {
          tour: 3,
          arbitre: false,
          auteur: 'Amen',
          verdict: {
              fin: false,
              pause: false,
              poursuite: true,
              texte: '',
              image: '',
              revendications: [
                  {
                      roliste: '',
                      arbitre: false,
                      combattant: '',
                      texte: ''
                  }
              ]
          },
          contre: {
              date: '21/06/2023',
              heure: '01:33',
              combattant: 'Chinoike Hikari',
              reactions: {
                  like: 0,
                  dislike: 0,
                  surpris: 0,
                  triste: 0,
                  drole: 0,
              },
              image: '/images/combats/rp_1/tour_3_pave_1.jpg',
              texte: `Hikari n'était pas assez naïf pour croire que Tagar serait battu aussi vite.. Il fut impressionné cependant par la réactivité du Uchiha qui disparut à temps sous l'eau pour éviter les lances aqueuses....

Que pouvait il manigancer sous l'eau pensa  Hikari  tout en cessant de maintenir les mains jointes et en observant  un étrange phénomène.......

Des tourbillons d'eau.. Des spirales qui se propagaient(depuis le centre de l'endroit Où Tagar se trouvait auparavant) vers Hikari..
Celui se doutait bien que cela n'augurait rien de bon. Il sentait qu'il pouvait perdre l'équilibre et se faire entraîner vers le centre du cyclone à tout moment malgré sa maîtrise en chakra.... Se retrouver piéger dans les eaux ne l'effrayait pas particulièrement mais avec un ennemi sous l'eau attendant il valait mieux parer en même temps à la menace.. Un mudra composé,  il crache une énorme quantité d'eau  expulsant ainsi 2 vagues géantes se chevauchant dont la première est haute de 10m sur 10m de large et la seconde de 5m sur 5m de large  L'eau de la première vague est maintenue en  le gardant au sommet en sécurité . Il n'était pas encore décidé à l'expulser... La seconde vague plus grande, se renouvelle sur elle-même à la même position... Hikari surfe soudain à grande vitesse 8m/s  sur la première vague lorsqu'il vit le Uchiha sortir brusquement de l'eau levitant à 10 m au dessus de l'eau grâce à une épée étrange.. Celui ci devait faire face toutefois à l'eau déchaînée. Les flots l'emportant déjà.. ( la vitesse de l'eau est aussi de 8m/s)L'assaut continue avec la seconde vague.

Une fois déversée, l'eau se répand sur 50m devant la position de création en direction du sens du déversement..
Tout en se rapprochant Hikari sur la vague avait fini de composer un autre mudra.. Des orbes aqueuses suivant la direction de ses mains se forment  dans les airs  et retombent violemment sur le Uchiha déjà en difficulté avec l'eau des vagues 🌊. 
Hikari guide les orbes selon les directions prises par Tagar pour y échapper éventuellement. Ayant une large portée, cette technique est difficile à esquiver.  Submergé par l'eau le Uchiha ne pouvait pas voir les mudras composés par Hikari tandis que sa respiration devenait difficile et ses mouvements entravés..
AC 



Ketsuryûgan
Suiton Vague explosive
Suiton- grêle d'eau`,
              actionCaches: {
                  presence: false,
                  listeTechniques: [
                      {
                          name: '',
                          lien: '',
                          debut: true,
                          enCours: false,
                          fin: false
                      }
                  ],
                  texte: ''
              }
          }
      },
      {
          tour: 3,
          arbitre: false,
          auteur: 'Rik',
          verdict: {
              fin: false,
              pause: false,
              poursuite: true,
              texte: '',
              image: '',
              revendications: [
                  {
                      roliste: '',
                      arbitre: false,
                      combattant: '',
                      texte: ''
                  }
              ]
          },
          contre: {
              date: '20/06/2023',
              heure: '23:42',
              combattant: 'Uchiha Tagar',
              reactions: {
                  like: 0,
                  dislike: 0,
                  surpris: 0,
                  triste: 0,
                  drole: 0,
              },
              image: '/images/combats/rp_1/tour_3_pave_2.jpg',
              texte: `La hauteur prise était une bonne idée apparemment. Déjà en hauteur que plus d'eau s'élève en sa direction.

Sans hâte, la lame tenue dans la main gauche s'éleva plus haut encore dans les airs, laissant Hikari se rapprocher de lui par le bas.

L'apparition des orbes aqueuses dans l'air déclenche le premier souffle de feu Tagar, une dizaine de mètres au dessus de son belligérant.

Un dragon géant de feu se manifesta et dissipa les gouttelettes d'eau tout en continuant jusqu'à Hikari.

La proximité joue maintenant en sa faveur autant que la taille et la vitesse du dragon de feu. Dans l'ombre du jutsu, Tagar se retira et finit sa course sur l'eau de l'autre côté de la zone d'impact par sa droite.

Une course circulaire commence ensuite sur la surface de l'eau, gardant de profil une vision sur Hikari. Le katana rangé, les choses allaient maintenant débuter.

Katon - feu du dragon suprême 👣
Katana volant 👣`,
              actionCaches: {
                  presence: false,
                  listeTechniques: [
                      {
                          name: '',
                          lien: '',
                          debut: true,
                          enCours: false,
                          fin: false
                      }
                  ],
                  texte: ''
              }
          }
      }
  ]
}
const combat1vs1AvecArbitre = {
  arbitre: {
      presence: true,
      principal: {
          idArbitre: '',
          nom: 'Darl Vinsmoke',
          pseudo: 'Darl'
      }
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
          roliste: 'Rik',
          rolisteRemplacement: false,
          rolisteRemplace: '',
          clan: 'Uchiha',
          nom: 'Tagar',
          image: '/images/combats/tagar.jpg',
          idPersonnage: '',
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
      description: '',
      latence: {
          presence: false,
          delai: 0,
          typeLatence: 'min'
      }
  },
  situation: {
      fin: true,
      dateDebut: '01/05/2024',
      dateFin: '04/05/2024',
      lastDate: '04/05/2024'
  },
  deroulement: [
    {
        tour: 1,
        arbitre: false,
        auteur: 'Amen',
        verdict: {
            auteur: 'Darl',
            fin: false,
            pause: false,
            poursuite: true,
            date: '20/06/2023',
            heure: '22:00',
            texte: `Rien à signaler, tout peut se poursuivre comme décrit dans le précédent contre.`,
            image: '',
            revendications: [
                {
                    roliste: '',
                    arbitre: false,
                    combattant: '',
                    texte: ''
                }
            ]
        },
        contre: {
            date: '20/06/2023',
            heure: '21:36',
            combattant: 'Hikari  Chinoike',
            reactions: {
                like: 0,
                dislike: 0,
                surpris: 0,
                triste: 0,
                drole: 0,
            },
            image: '',
            texte: `\tUn jeune shinobi marche lentement vers son destin......Où pouvait il se trouver actuellement..... 
    Le soleil dans son ascension vers le zenith. La rivière s'écoulant inlassablement dans la vallée de la fin sous forme d'une cascade.. 
    Hikari Chinoike vêtu de sa cape à capuche se trouvait sur la tête d'une statue particulière... représentant Hashirama Senju le premier Hokage de Konoha..... Dans son excursion vers le pays du feu il était passé par cet endroit mythique.. Sa mission était simple....
    Partir à konoha en quête des Uchiha. Animé par la flamme de la vengeance contre ce clan qui avait exterminé le sien.... 

    Le vent secouant sa cape il faisait face soudain à un shinobi qui ressemblait pratiquement de loin au personnage sur lequel il se tenait debout......Madara Uchiha?....

    Impossible.. Mais le shinobi devait être de son clan.. Les cheveux, l'allure........

    25 m les séparait...
    Hikari espérait secrètement que cela soit un Uchiha....

    <<Qui es tu ? >> demanda t'il d'une voix forte ? 

    Tout en lui parlant Hikari l'observait attentivement à l'affût du moindre mouvement suspect..
    Si c'était bien un Uchiha alors il ne tarderait pas à sentir l'animosité de Hikari........ 

    Action en cours`,
            actionCaches: {
                presence: false,
                listeTechniques: [
                    {
                        name: '',
                        lien: '',
                        debut: true,
                        enCours: false,
                        fin: false
                    }
                ],
                texte: ''
            }
        }
    },
    {
        tour: 1,
        arbitre: false,
        auteur: 'Rik',
        verdict: {
            auteur: 'Darl',
            fin: false,
            pause: false,
            poursuite: true,
            date: '20/06/2023',
            heure: '22:20',
            texte: `A cette fin de tour, voici la situation du combat :`,
            image: '',
            revendications: [
                {
                    roliste: '',
                    arbitre: false,
                    combattant: '',
                    texte: ''
                }
            ]
        },
        contre: {
            date: '20/06/2023',
            heure: '22:15',
            combattant: 'Uchiha Tagar',
            reactions: {
                like: 0,
                dislike: 0,
                surpris: 0,
                triste: 0,
                drole: 0,
            },
            image: '',
            texte: `Prenant du bon temps assis sur la tête de la statue de mon ancêtre, j'observais l'horizon.

L'air frais qui se dégageait de ce lieu m'apportait une certaine harmonie. Une sensation reposante qui m'adoucissait l'esprit.

En ce lieu, j'arrivais à ne faire qu'un avec la nature, plongé dans les souvenirs de ce que serait une vie sans histoire.

Une vie loin de toute ces réalités. Une réalité qui ne restera sans doute qu'illusoire. Quelle ironie ! Porter un pouvoir qui interprète clairement son destin...

Dans ce léger sourire qu'arborait mon visage, une présence se fit ressentir. Les yeux sur l'horizon, j'aperçus son regard.

On y voyait de la haine. Ce regard empli de vengeance que j'avais jadis. Le destin ne cessera donc jamais de me faire face. Telle est ma dure réalité.

Me laissant tomber du haut de cette falaise, je me laissais porter par le vent. Le regard dressé sur le jeune homme devant moi, ma descente se stabilisait progressivement.

Mon chakra commençait ainsi à apprivoiser la gravité afin de lui dicter mon point de chute. Quelques secondes s'écoulaient avant que l'impact sur la surface de l'eau n'éclabousse l'horizon.

Le voile des gouttelettes d'eau levées se dissipa et laissait face moi, immobile sur la surface de l'eau, depuis une vingtaine de mètres environ, mon adversaire.

<< Je suis Uchiha Tagar. Que me vaut bien ta présence, étranger... >>`,
            actionCaches: {
                presence: false,
                listeTechniques: [
                    {
                        name: '',
                        lien: '',
                        debut: true,
                        enCours: false,
                        fin: false
                    }
                ],
                texte: ''
            }
        }
    },
    {
        tour: 2,
        arbitre: false,
        auteur: 'Amen',
        verdict: {
            auteur: 'Darl',
            fin: false,
            pause: false,
            poursuite: true,
            texte: `Voici un extrait du jutsu utilisé par Hikari. Veuillez donc bien à prendre soin de savoir ce que cela donnera en situation.`,
            image: '/images/combats/rp_1/tour_2_verdict_1.gif',
            revendications: [
                {
                    roliste: '',
                    arbitre: false,
                    combattant: '',
                    texte: ''
                }
            ]
        },
        contre: {
            date: '20/06/2023',
            heure: '23:15',
            combattant: 'Chinoike Hikari',
            reactions: {
                like: 0,
                dislike: 0,
                surpris: 0,
                triste: 0,
                drole: 0,
            },
            image: '',
            texte: `Tandis que le shinobi descendait avec grâce et elegance de la statue de Madara Uchiha, un malaise s'emparait progressivement de Hikari...... Ce chakra... Nul besoin d'entre sensoriel pour percevoir la puissance de cet individu..

Ainsi il se nomme Tagar Uchiha... Est ce l'individu..

Hikari parvient à dominer sa peur, malaxant son chakra et conservant l' équilibre sur l'eau.. 

20 m les séparant.
Je suis Hikari Chinoike. Le nom de mon clan doit te dire quelque chose.. Sinon peu importe j'étais en route pour Konoha pour  venger le clan Chinoike que tes ancêtres ont exterminé. L'existence des Uchiha m'insupporte...


En garde

Sur ces mots Hikari compose rapidement une série de mudras  et garde les mains jointes....  Une seconde suffisante à cela tandis que de l'eau environnante autour de Tagar à 10 m de lui s'élève soudain  une dizaine de puissants jets d'eau sous forme de vague coupantes lancés (30 cm de largeur et 15 m de longueur) l'encerclant en ne lui laissant aucun angle mort de riposte et s'abattant sur lui le perforant et le coupant aussi au passage à la vitesse de 7m/s....

Les mains toujours jointes les iris de Hikari viraient vers le rouge plus sombre qu'ecarlate  tandis que les pupilles ( une seule ligne) prenaient une couleur violette....

Il ne comptait pas perdre de vue la riposte de Tagar et devait avant tout se méfier de ses sharingan.. 

Action en cours.. 
Suiton- Cône du déluge (Version lances de Tobirama vs Hiruzen  grâce à la manipulation de l'eau environnante) 
Ketsuryûgan`,
            actionCaches: {
                presence: false,
                listeTechniques: [
                    {
                        name: '',
                        lien: '',
                        debut: true,
                        enCours: false,
                        fin: false
                    }
                ],
                texte: ''
            }
        }
    },
    {
        tour: 2,
        arbitre: false,
        auteur: 'Rik',
        verdict: {
            fin: false,
            pause: false,
            poursuite: true,
            texte: ``,
            image: '',
            revendications: [
                {
                    roliste: '',
                    arbitre: false,
                    combattant: '',
                    texte: ''
                }
            ]
        },
        contre: {
            date: '20/06/2023',
            heure: '23:42',
            combattant: 'Uchiha Tagar',
            reactions: {
                like: 0,
                dislike: 0,
                surpris: 0,
                triste: 0,
                drole: 0,
            },
            image: '',
            texte: `Sans crier gare, les hostilités débutèrent. L'aura meurtrière de l'adversaire avait trahi ses intentions. Ses premiers mouvements coïncidaient avec la présence du sharingan aux 3 tomoes dans mes pupilles.

La rapidité de ses mudra donnait une impression sur son talent. Néanmoins, la vision dynamique du sharingan était à mon avantage.

L'eau commençait à être imbibée de chakra et sa densité augmentait au point où j'étais semble t-il, piégé dans son jutsu.

Les lances aqueuses émergèrent mais leur vitesse m'était perceptible. J'anticipais leur trajectoire en sentant leur présence autant dans mon dos qu'au bruit de l'eau autour de moi.

Soudain, l'eau m'aspira !

Trop évident pour y penser mais parfait pour détourner l'attention. Je venais d'arrêter d'emmagasiner du chakra sous mes pieds et me suis ainsi laissé tomber dans l'eau.

La vitesse de mon abaissement avait profité à ma réactivité. J'échappais ainsi à l'entrechoque des lances aqueuses qui se détruisaient entre elles.

Sous l'eau, j'avais donc réussi à m'éclipser en orientant ma descente par le poids de mon corps et cette fois, les vagues répondaient à mon appel.

Un orbe tourbillonnant se formait dans le creux de ma main droite pendant que l'eau tout autour de moi était entraîné dans ces flots impétueux.

La taille de l'orbe avait rapidement augmenté et la pression de l'eau attirait à moi, centre du cyclone, mon adversaire piégé dans les eaux.

Mon Katana était en parallèle dégainé. Sa lame s'imprègne d'une aura blanche qui réagissait à mon chakra quand tout à coup, je m'élevais tiré par la lame.

Sorti de l'eau telle une flèche et en hauteur d'une dizaine de mètres environ, un mudra était maintenu dans ma main droite qui plus tôt, avait servi à former l'Orbe tourbillonnant.

Regard fixé sur l'adversaire, j'observais avec prudence sa réaction suite à ma contre-attaque.

Rasengan 👣
Katana volant 👣
Ac 👣`,
            actionCaches: {
                presence: false,
                listeTechniques: [
                    {
                        name: '',
                        lien: '',
                        debut: true,
                        enCours: false,
                        fin: false
                    }
                ],
                texte: ''
            }
        }
    }
  ]
}
const combats = [
  {
      id: 1,
      combat1vs1: true,
      combat1vs2: false,
      combat2vs2: false,
      combatBR: false,
      combattants: [
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
      ],
      details: combat1vs1SansArbitre
  },
  {
      id: 2,
      combat1vs1: true,
      combat1vs2: false,
      combat2vs2: false,
      combatBR: false,
      combattants: [
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
      ],
      details: combat1vs1AvecArbitre
  },
  {
      id: 3,
      combat1vs1: false,
      combat1vs2: false,
      combat2vs2: true,
      combatBR: false,
      combattants: [
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
          '/images/statuts/ambu.jpg',
      ],
      details: combat1vs1SansArbitre
  }
]
const imgArbitre = '/images/random.jpg'

// Fonctions de récupération de l'image du rôliste
const getCombattantImg = (nameRoliste: string) => {
    let source = '/images/statuts/ambu.jpg'
    combats[0].details.combattants.forEach((combattant) => {
        if (combattant.roliste == nameRoliste) {
            source = combattant.image
        }
    })
    return source
}

export default function AreneDeCombat() {
  // Récupérer l'ID du combat depuis l'URL
  const searchParams = useSearchParams();
  const combatIdFromUrl = searchParams.get('id');
  const combatArenaFromUrl = searchParams.get('arene');
  const [fight, setFight] = useState({});
  const [contres, setContres] = useState<ContreType[]>([])

  // Récupération des messages du combat
  useEffect(() => {
    fetch(`http://localhost:8001/arene/${combatArenaFromUrl}/combats/${combatIdFromUrl}`)
      .then(res => res.json())
      .then(data => {
        setFight(data.combat);
        setContres(() => data.messages.map((combat: any, idx: number) => ({
            id: idx + 1,
            auteur: combat.sender,
            combattant: combat.author,
            texte: combat.message,
            image: null,
            date: combat.date,
            heure: combat.time
        })))
      })
  }, [combatIdFromUrl, combatArenaFromUrl]);

  // Récupération des combattants
  const shinobi = [
    {
      nom: fight.combattant_1,
      image: "https://i.pinimg.com/736x/f5/58/73/f558736d6a147e444bfe18026a92f413.jpg",
      roliste: fight.roliste_1
    },
    {
      nom: fight.combattant_2,
      image: "https://i.pinimg.com/736x/c9/9b/4a/c99b4a74540467050554d308fd1e446d.jpg",
      roliste: fight.roliste_2
    }
  ]
  const c1 = shinobi[0]
  const c2 = shinobi[1]
  const terrainImg = '/images/terrains/arena-bg.jpg' // Personnalise selon le combat si besoin  

//   const [contres, setContres] = useState<ContreType[]>(
//     figtMessages.map((combat: any, idx: number) => ({
//       id: idx + 1,
//       auteur: combat.sender,
//       combattant: combat.author,
//       texte: combat.message,
//       image: null,
//       date: combat.date,
//       heure: combat.time
//     }))
//   )

  // Pour gérer l'affichage "voir plus" de chaque contre
  const [expandedContres, setExpandedContres] = useState<{[id:number]: boolean}>({})
  const toggleContre = (id: number) => {
    setExpandedContres(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Fonction utilitaire pour compter les lignes d'un texte (en fonction du nombre de '\n')
  const countLines = (text: string) => text.split(/\r?\n/).length

//   if (loading) return <div className="loader">Chargement du parchemin de combat...</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
        {/* Header immersif sticky/fixed avec avatars VS et timer  sticky top-0 z-30 */}
        <div className="fixed top-0 right-0 left-0 z-30 w-full flex flex-col items-center pt-8 pb-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-md">
            <div className="flex items-center gap-10 mb-2">
                <div className="flex flex-col items-center relative">
                    {/* <Image src={c1.image} alt={c1.nom} width={80} height={80} className="rounded-full border-4 border-blue-500 shadow-xl ring-2 ring-blue-300" /> */}
                    <span className="absolute -inset-2 rounded-full border-2 border-blue-400 animate-pulse pointer-events-none"></span>
                    <span className="text-blue-300 font-bold mt-1 text-lg drop-shadow">{capitalizeText(c1.nom || '')}</span>
                    <span className="text-xs text-gray-400">{capitalizeText(c1.roliste || '')}</span>
                </div>
                <span className="text-5xl font-extrabold text-white drop-shadow-lg animate-pulse">VS</span>
                <div className="flex flex-col items-center relative">
                    {/* <Image src={c2.image} alt={c2.nom} width={80} height={80} className="rounded-full border-4 border-red-500 shadow-xl ring-2 ring-red-300" /> */}
                    <span className="absolute -inset-2 rounded-full border-2 border-red-400 animate-pulse pointer-events-none"></span>
                    <span className="text-red-300 font-bold mt-1 text-lg drop-shadow">{capitalizeText(c2.nom || '')}</span>
                    <span className="text-xs text-gray-400">{capitalizeText(c2.roliste || '')}</span>
                </div>
            </div>
            <div className="flex gap-4 mt-2 items-center">
            <Link href="/arene">
                <button className="text-gray-400 hover:text-red-500 text-2xl">
                    <X size={30} />
                </button>
            </Link>
            </div>
        </div>
        <div className="mb-4 mt-36">
            <h5 className="text-md font-semibold text-white mb-1">Informations de combat</h5>
            <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
                <li>Arbitre : <span className="text-indigo-300">{capitalizeText(fight?.arbitre || '')}</span></li>
                <li>Lieu : <span className="text-indigo-300">{capitalizeText(fight?.arena || '')}</span></li>
                <li>Clôturé : <span className="text-indigo-300">{fight?.valid_closure ? "✅" : "🚫"}</span></li>
                <li>Vainqueur : <span className="text-indigo-300">{capitalizeText(fight?.win || '')}</span></li>
            </ul>
        </div>
        {/* Zone d'échanges de contres immersive */}
        <div className="relative w-full max-w-3xl flex-1 flex flex-col gap-6 py-8 px-4 rounded-2xl bg-black/70 border-2 border-indigo-900 shadow-2xl backdrop-blur-md overflow-y-auto mt-2 k">
            {/* Overlay d'opacité décroissante en haut */}
            <h2 className="text-2xl font-bold text-indigo-300 mb-4 text-center uppercase tracking-widest">Échanges de contres</h2>
            <div className="flex flex-col gap-4">
            {contres.map((c, idx) => {
              const isExpanded = expandedContres[c.id] || false
              const lineCount = countLines(c.texte)
              const shouldClamp = !isExpanded && lineCount > 10
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`flex items-start gap-3 bg-gray-800/80 ${c.combattant.includes("arbitre") ? 'border-yellow-400 border-x-4' : c.auteur === c1.roliste ? 'border-blue-400 border-l-4' : 'border-red-400 border-r-4'} rounded-lg p-4 shadow`}
                >
                  <Image src={c.combattant.includes("arbitre") ? imgArbitre : c.combattant === c1.nom ? c1.image : c2.image} alt={c.combattant} width={40} height={40} className="rounded-full border-2 border-white/30" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {c.combattant.includes("arbitre") ? <span className="text-yellow-400 font-bold text-xs uppercase">Arbitre</span> :
                      <span className={`font-bold text-base ${c.auteur === c1.roliste ? 'text-blue-300' : 'text-red-300'}`}>{capitalizeText(c.combattant)}</span> }
                      <span className="text-xs text-gray-400">{c.date} {c.heure}</span>
                    </div>
                    <div className={`text-gray-200 text-base text-sm font-mono mb-2 transition-all duration-300 whitespace-pre-wrap ${shouldClamp ? 'overflow-hidden max-h-[16.5em]' : ''}`}
                      style={shouldClamp ? { display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical', whiteSpace: 'pre-wrap' } : { whiteSpace: 'pre-wrap' }}>
                      {c.texte}
                    </div>
                    {lineCount > 10 && (
                      <button
                        className="text-indigo-400 hover:text-indigo-200 text-sm font-semibold mt-1 focus:outline-none"
                        onClick={() => toggleContre(c.id)}
                      >
                        {isExpanded ? 'Voir moins' : 'Voir plus'}
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
            </div>
        </div>
    </div>
  )
}