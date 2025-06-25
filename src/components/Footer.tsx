export default function Footer({}) {
    return (
        <footer className="bg-dark-card border-t border-border-dark py-8 text-center">
            <div className="container mx-auto px-6">
                <p className="text-text-secondary">© {new Date().getFullYear()} Kage no Densetsu - Tous droits réservés.</p>
                <p className="text-sm text-gray-500 mt-2">Une communauté de jeu de rôle passionnée par l&apos;univers de Naruto.</p>
            </div>
        </footer>
    )
};