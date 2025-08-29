import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProposalForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    theme: 'habitat',
    location: '',
    need: '',
    actors: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://abilden-api.onrender.com/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    navigate(`/browse/${form.theme}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Nouvelle proposition</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Titre" className="border p-2 w-full" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Lieu" className="border p-2 w-full" />
        <input name="need" value={form.need} onChange={handleChange} placeholder="Besoin adressé" className="border p-2 w-full" />
        <input name="actors" value={form.actors} onChange={handleChange} placeholder="Acteurs pressentis" className="border p-2 w-full" />
        <select name="theme" value={form.theme} onChange={handleChange} className="border p-2 w-full">
          <option value="habitat">Habitat</option>
          <option value="mobilite">Mobilité</option>
          <option value="alimentation">Alimentation</option>
          <option value="technologie">Technologie</option>
          <option value="temps_partage">Temps partagé</option>
          <option value="imaginaire">Imaginaire</option>
          <option value="education">Éducation</option>
        </select>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" rows="4" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Publier</button>
      </form>
    </div>
  );
}
