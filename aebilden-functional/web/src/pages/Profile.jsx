import React, { useEffect, useState } from 'react';

/**
 * Profile page displays the current user's contributions.
 *
 * For this MVP the user ID is hard‑coded to 'anonymous'. In a real
 * application the user would be authenticated via Supabase Auth and
 * their unique ID would be used. The component fetches the user's
 * proposals, clarifications and objections from dedicated API
 * endpoints and renders them in separate sections.
 */
export default function Profile() {
  const userId = 'anonymous';
  const [myProposals, setMyProposals] = useState([]);
  const [myClarifications, setMyClarifications] = useState([]);
  const [myObjections, setMyObjections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resProps = await fetch(`/proposals/user/${userId}`);
        const propsData = await resProps.json();
        const resClars = await fetch(`/clarifications/user/${userId}`);
        const clarsData = await resClars.json();
        const resObjs = await fetch(`/objections/user/${userId}`);
        const objsData = await resObjs.json();
        setMyProposals(propsData);
        setMyClarifications(clarsData);
        setMyObjections(objsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  if (loading) return <p>Chargement…</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Mon profil</h2>
      <h3>Mes propositions</h3>
      {myProposals.length === 0 ? (
        <p>Aucune proposition.</p>
      ) : (
        myProposals.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <h4>{p.title}</h4>
            <p>{p.description}</p>
          </div>
        ))
      )}
      <h3>Mes clarifications</h3>
      {myClarifications.length === 0 ? (
        <p>Aucune clarification.</p>
      ) : (
        myClarifications.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <p>
              <strong>Question :</strong> {c.question}
            </p>
            <p>
              <strong>Réponse :</strong> {c.answer || '—'}
            </p>
          </div>
        ))
      )}
      <h3>Mes objections</h3>
      {myObjections.length === 0 ? (
        <p>Aucune objection.</p>
      ) : (
        myObjections.map((o) => (
          <div key={o.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <p>
              <strong>Risque :</strong> {o.description}
            </p>
            <p>
              <strong>Amélioration suggérée :</strong> {o.suggested_change || '—'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}