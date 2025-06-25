'use client';

// Importation des dépendances nécessaires
import { JSX, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = (): JSX.Element => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/personnages', label: 'Personnages' },
        { href: '/boutique', label: 'Boutique Ninja' },
        // { href: '#videos', label: 'Vidéos' },
    ];

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-border-dark"
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="#hero" className="text-2xl font-bold text-text-light">
                    Kage no <span className="text-orange-primary">Densetsu</span>
                </Link>
                
                {/* Menu pour ordinateur */}
                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="hover:text-orange-primary transition-colors">{link.label}</Link>
                    ))}
                    <a href="https://wa.me/33615641467" target="_blank" rel="noopener noreferrer" className="bg-orange-primary text-text-light px-4 py-2 rounded-full font-semibold hover:bg-orange-hover transition-colors">
                        Contact
                    </a>
                </div>

                {/* Bouton du menu mobile */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Menu déroulant pour mobile */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-dark-card flex flex-col items-center space-y-4 py-4"
                >
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="hover:text-orange-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <a href="https://wa.me/33615641467" target="_blank" rel="noopener noreferrer" className="bg-orange-primary text-text-light px-4 py-2 rounded-full font-semibold hover:bg-orange-hover transition-colors">
                        Contact
                    </a>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;