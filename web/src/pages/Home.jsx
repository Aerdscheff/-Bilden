import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const themes = [
    'habitat',
    'mobilite',
    'alimentation',
    'technologie',
    'temps_partage',
    'imaginaire',
    'education'
  ];
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Ä/Bilden</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Link key={theme} to={`/browse/${theme}`} className="p-4 border rounded shadow">
            {theme}
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link to="/proposals/new" className="mr-4">Faire une proposition</Link>
        <Link to="/fast" className="mr-4">Fast</Link>
        <Link to="/forum" className="mr-4">Forum citoyen</Link>
        <Link to="/profile">Mon profil</Link>
      </div>
    </div>
  );
}
