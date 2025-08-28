import React, { useEffect, useState } from 'react';

/**
 * The Fast component presents proposals from all themes in random order.
 *
 * It fetches proposals from the special `/proposals/fast` endpoint and
 * displays them as cards with action buttons for consent, objection or
 * clarification. When a user performs a swipe action (via buttons on
 * desktop), the corresponding API call is sent and an acknowledgement
 * is shown. The randomisation of proposals is performed server‑side
 * (via the endpoint) or could be implemented client‑side for small
 * datasets.
 */
export default function Fast() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/proposals/fast');
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
  if (proposals.length === 0) return <p>Aucune proposition disponible.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>FAST – toutes thématiques</h2>
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