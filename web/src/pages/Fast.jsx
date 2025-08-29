import React, { useState, useEffect } from 'react';

export default function Fast() {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchFast = async () => {
      try {
        const res = await fetch('https://abilden-api.onrender.com/proposals/fast');
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFast();
  }, []);

  const handleConsent = async (id) => {
    await fetch('https://abilden-api.onrender.com/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal_id: id, direction: 'right' })
    });
  };

  const handleObjection = async (id) => {
    const description = prompt('Indiquez le risque ou problème :');
    const suggested_change = prompt('Proposez une amélioration :');
    if (!description || !suggested_change) return;
    await fetch('https://abilden-api.onrender.com/objection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal_id: id, description, suggested_change })
    });
  };

  const handleClarification = async (id) => {
    const question = prompt('Quelle question souhaitez-vous poser ?');
    if (!question) return;
    await fetch('https://abilden-api.onrender.com/clarification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal_id: id, question })
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Fast feed</h1>
      {proposals.map((p) => (
        <div key={p.id} className="p-4 mb-4 border rounded">
          <h2 className="font-bold">{p.title}</h2>
          <p>{p.description}</p>
          <div className="mt-2">
            <button onClick={() => handleConsent(p.id)} className="mr-2">Consentir</button>
            <button onClick={() => handleObjection(p.id)} className="mr-2">Objection</button>
            <button onClick={() => handleClarification(p.id)}>Clarifier</button>
          </div>
        </div>
      ))}
    </div>
  );
}
