import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Browse() {
  const { theme } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/proposals/${theme}`);
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [theme]);

  async function handleSwipe(id, action) {
    let comment = '';
    if (action === 'objection') {
      comment = prompt('Décrivez le risque et l’amélioration possible :');
    }
    if (action === 'clarification') {
      comment = prompt('Posez votre question :');
    }
    await fetch('/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'anonymous', proposal_id: id, action, comment }),
    });
    alert('Merci pour votre retour !');
  }

  if (loading) return <p>Chargement…</p>;
  if (proposals.length === 0) return <p>Aucune proposition dans cette thématique.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Propositions pour « {theme} »</h2>
      {proposals.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <div>
            <button onClick={() => handleSwipe(p.id, 'consent')}>Consentement</button>
            <button onClick={() => handleSwipe(p.id, 'objection')}>Objection</button>
            <button onClick={() => handleSwipe(p.id, 'clarification')}>Clarification</button>
          </div>
        </div>
      ))}
    </div>
  );
}