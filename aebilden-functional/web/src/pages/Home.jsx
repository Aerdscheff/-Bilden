import React from 'react';
import { Link } from 'react-router-dom';

const themes = [
  'habitat',
  'mobilite',
  'alimentation',
  'technologie',
  'temps_partage',
  'imaginaire',
  'education',
];

export default function Home() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Ä/Bilden</h1>
      <p>Choisissez une thématique :</p>
      <ul>
        {themes.map((theme) => (
          <li key={theme}>
            <Link to={`/browse/${theme}`}>{theme}</Link>
          </li>
        ))}
      </ul>
      <p>
        Ou <Link to="/proposals/new">faire une proposition</Link>
      </p>
      <p>
        <Link to="/fast">Fast (toutes thématiques)</Link>
      </p>
      <p>
        <Link to="/forum">Forum citoyen</Link>
      </p>
      <p>
        <Link to="/profile">Mon profil</Link>
      </p>
    </div>
  );
}