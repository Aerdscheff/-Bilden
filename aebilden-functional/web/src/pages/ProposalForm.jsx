import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProposalForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    context: '',
    theme: '',
    location: '',
    need: '',
    actors: '',
  });
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      setStatus('Proposition créée !');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Nouvelle proposition</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre : </label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description : </label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Contexte : </label>
          <textarea name="context" value={form.context} onChange={handleChange} />
        </div>
        <div>
          <label>Thématique : </label>
          <select name="theme" value={form.theme} onChange={handleChange} required>
            <option value="">-- Sélectionner --</option>
            <option value="habitat">Habitat</option>
            <option value="mobilite">Mobilité</option>
            <option value="alimentation">Alimentation</option>
            <option value="technologie">Technologie</option>
            <option value="temps_partage">Temps partagé</option>
            <option value="imaginaire">Imaginaire</option>
            <option value="education">Éducation</option>
          </select>
        </div>
        <div>
          <label>Lieu : </label>
          <input name="location" value={form.location} onChange={handleChange} />
        </div>
        <div>
          <label>Besoin adressé : </label>
          <input name="need" value={form.need} onChange={handleChange} />
        </div>
        <div>
          <label>Acteurs pressentis : </label>
          <input name="actors" value={form.actors} onChange={handleChange} />
        </div>
        <button type="submit">Publier</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}