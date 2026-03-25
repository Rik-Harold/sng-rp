"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Swords, Gamepad2, Trophy, Store } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'

// --- DONNÉES DE LA PAGE ---
// Centraliser les données facilite leur mise à jour.

const characters = [
  { name: 'Harukai', img: '/avatars/profil/harukai.png' },
  { name: 'Minachi', img: '/avatars/profil/minachi.png' },
  { name: 'Killshot', img: '/avatars/profil/killshot.png' },
  { name: 'Shinki', img: '/avatars/profil/shinki.png' },
  { name: 'Toka', img: '/avatars/profil/toka.png' },
  { name: 'Inara', img: '/avatars/profil/inara.png' },
  { name: 'Hayame', img: '/avatars/profil/hayame.png' },
];

const activities = [
  { 
    icon: <Swords className="h-8 w-8 text-orange-primary" />, 
    title: "Combats d'Arène", 
    description: "Affrontez d'autres ninjas dans des combats stratégiques supervisés par un arbitre pour garantir l'équité." 
  },
  { 
    icon: <Trophy className="h-8 w-8 text-orange-primary" />, 
    title: "Tournois & Battle Royale", 
    description: "Misez sur vos compétences et participez à des tournois à grande échelle ou des battle royales où un seul survivra." 
  },
  { 
    icon: <Gamepad2 className="h-8 w-8 text-orange-primary" />, 
    title: "Quiz & Événements", 
    description: "Testez vos connaissances de l'univers Naruto et participez à des événements communautaires pour gagner des prix." 
  },
  { 
    icon: <Store className="h-8 w-8 text-orange-primary" />, 
    title: "Boutique du Ninja", 
    description: "Utilisez vos gains pour acheter des équipements, des techniques ou des objets rares dans notre boutique exclusive." 
  },
];

const videoUrls = [
  "https://www.youtube.com/embed/yt0fjgCxRi8",
  "https://www.youtube.com/embed/XK4CoeOUawk",
  "https://www.youtube.com/embed/f0I3uO272uQ",
  "https://www.youtube.com/embed/WOuZubpyYIA",
  "https://www.youtube.com/embed/QgSfAfQT5bI",
];

// Liste des images pour le carrousel
const carouselImages = [
    "/images/events/logo-sng.png",
    "/images/events/shinobi_new_generation.png",
    "/images/events/sng_icon.jpeg",
    "/images/events/sng.jpeg",
    "/images/events/sng_group.jpeg",
    "/images/events/sng_urpg.jpeg",
];


// --- VARIANTES D'ANIMATION (FRAMER MOTION) ---
const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Apparition en cascade des éléments enfants
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};


// --- COMPOSANT PRINCIPAL DE LA PAGE ---

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <AboutSection />
        <CharactersSection />
        <ActivitiesSection />
        <VideosSection />
      </main>
    </>
    // Assurez-vous d'importer une police comme 'Poppins' dans votre fichier /app/layout.tsx si vous souhaitez l'utiliser
    // <div className="bg-dark-bg text-text-light min-h-screen font-sans overflow-x-hidden">
    // </div>
  );
}

// --- COMPOSANTS DÉTAILLÉS ---


const HeroSection = () => (
  <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24">
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-5xl md:text-7xl font-extrabold mb-4"
    >
      Créez Votre <span className="text-orange-primary animate-glow">Légende Ninja</span>
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8"
    >
      Plongez dans un univers Naruto unique où votre imagination est la seule limite.
      Créez vos propres personnages (OC), développez leurs techniques et forgez votre propre destinée de ninja.
    </motion.p>
    <motion.a 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6, type: 'spring', stiffness: 120 }}
      href="https://chat.whatsapp.com/DsFy41iaK403IwMDhqeF38" 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-orange-primary text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg shadow-orange-primary/30 hover:bg-orange-hover hover:scale-105 transition-all transform"
    >
      Rejoindre la Communauté
    </motion.a>
  </section>
);

// Composant générique pour les sections afin d'éviter la répétition de code
const Section = ({ id, title, description, children }: { id: string, title: string, description: string, children: React.ReactNode }) => (
    <motion.section 
        id={id} 
        className="container mx-auto px-6 py-20 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
    >
        <h2 className="text-4xl font-bold mb-4 inline-block border-b-4 border-orange-primary pb-2">{title}</h2>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-12">{description}</p>
        {children}
    </motion.section>
);

// --- NOUVEAU : COMPOSANT CAROUSEL ---
const AboutCarousel = ({ slides }: { slides: string[] }) => {
    // Le plugin Autoplay n'est pas inclus par défaut, ceci est une implémentation simple
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    // Autoplay simple
    useEffect(() => {
        if (!emblaApi) return;
        const timer = setInterval(() => {
            emblaApi.scrollNext();
        }, 4000); // Défilement toutes les 4 secondes
        return () => clearInterval(timer);
    }, [emblaApi]);

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                <div className="flex">
                    {slides.map((imgSrc, index) => (
                        <div className="flex-[0_0_100%] aspect-video" key={index}>
                            <Image
                                src={imgSrc}
                                alt={`Image de la communauté ${index + 1}`}
                                width={1280}
                                height={720}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* Vous pouvez ajouter des boutons de navigation ici si vous le souhaitez */}
        </div>
    );
};

const AboutSection = () => (
    <Section
        id="about"
        title="Un Univers en Constante Évolution"
        description="Depuis plus de 5 ans, notre communauté rassemble des passionnés pour créer des histoires épiques. Chaque membre peut concevoir un ou plusieurs ninjas, les faire progresser à travers des missions, des entraînements et des combats pour devenir une véritable légende."
    >
        {/* NOUVEAU : Intégration du carrousel */}
        <AboutCarousel slides={carouselImages} />
    </Section>
);

const CharactersSection = () => (
    <Section
        id="characters"
        title="Une Communauté, des Centaines de Ninjas"
        description="Découvrez quelques-uns des nombreux personnages uniques créés par nos membres au fil des ans."
    >
        <motion.div 
          className="flex flex-wrap justify-center gap-6"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            {characters.map((char) => (
                <motion.div 
                    key={char.name} 
                    className="bg-dark-card p-4 rounded-xl border border-border-dark text-center"
                    variants={cardVariants}
                    whileHover={{ y: -10, scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Image 
                        src={char.img} 
                        alt={`Avatar de ${char.name}`} 
                        width={120} 
                        height={120} 
                        className="rounded-full border-4 border-orange-primary mx-auto mb-3"
                    />
                    <p className="font-semibold text-lg">{char.name}</p>
                </motion.div>
            ))}
        </motion.div>

        {/* Boutons d'interaction */}
        <motion.div 
            className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <a href="/Fandom_SNG.pdf" target="_blank" className="bg-transparent border-2 border-orange-primary text-orange-primary px-8 py-3 rounded-full text-lg font-bold hover:bg-orange-primary hover:text-white transition-all transform hover:scale-105 w-full sm:w-auto text-center">
              Consulter le fandom
            </a>
            <a href="https://wa.me/33615641467" target="_blank" rel="noopener noreferrer" className="bg-orange-primary text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg shadow-orange-primary/30 hover:bg-orange-hover hover:scale-105 transition-all transform w-full sm:w-auto text-center">
              Créer un personnage
            </a>
        </motion.div>
    </Section>
);

const ActivitiesSection = () => (
    <Section
        id="activities"
        title="Plus qu'un Jeu, une Économie"
        description="Votre talent de ninja peut vous rapporter gros. Participez à nos activités exclusives, gagnez des récompenses et utilisez-les pour équiper et améliorer vos personnages."
    >
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            {activities.map((activity, index) => (
                <motion.div 
                    key={index}
                    className="bg-dark-card p-6 rounded-lg border-l-4 border-orange-primary flex flex-col"
                    variants={cardVariants}
                    whileHover={{ y: -5, boxShadow: "0px 8px 15px rgba(255,102,0,0.1)" }}
                >
                    <div className="mb-4">{activity.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-text-light">{activity.title}</h3>
                    <p className="text-text-secondary">{activity.description}</p>
                </motion.div>
            ))}
        </motion.div>
    </Section>
);

const VideosSection = () => (
    <Section
        id="videos"
        title="La Communauté en Action"
        description="Revivez les moments forts de notre communauté, des combats mémorables aux événements spéciaux, directement depuis notre chaîne YouTube."
    >
      {/* <EvolutionCombats /> */}
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            {videoUrls.map((url, index) => (
                <motion.div
                    key={index}
                    className="aspect-video overflow-hidden rounded-lg border border-border-dark"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, zIndex: 10, boxShadow: "0 20px 30px rgba(0,0,0,0.5)" }}
                >
                    <iframe
                        src={url}
                        title={`Vidéo de la communauté ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </motion.div>
            ))}
        </motion.div>
    </Section>
);