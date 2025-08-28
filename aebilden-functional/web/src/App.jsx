import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Browse from './pages/Browse';
import ProposalForm from './pages/ProposalForm';
import Fast from './pages/Fast';
import Forum from './pages/Forum';
import Profile from './pages/Profile';

/**
 * Root component defining all application routes.
 *
 * This component wires together the high‑level pages used by the Ä/Bilden
 * PWA: selection des thématiques, création de proposition, navigation
 * "Fast" (aléatoire), Forum citoyen et profil utilisateur. Each route
 * maps to a dedicated component residing in the `pages` directory.  We
 * intentionally avoid a catch‑all route for unknown paths; in a
 * production application you might redirect unknown routes back to
 * the homepage or display a 404 page.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse/:theme" element={<Browse />} />
      <Route path="/proposals/new" element={<ProposalForm />} />
      <Route path="/fast" element={<Fast />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}