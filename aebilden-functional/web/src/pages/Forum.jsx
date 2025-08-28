import React, { useEffect, useState } from 'react';

/**
 * Forum component aggregates clarifications and objections.
 *
 * It fetches both clarifications and objections from the API and
 * displays them in separate sections. Each item shows the associated
 * proposal identifier (or title if available), the question/description
 * and any answer or suggested change. This view is read‑only; in a
 * full implementation, the author of a proposal could answer a
 * clarification here.
 */
export default function Forum() {
  const [clarifications, setClarifications] = useState([]);
  const [objections, setObjections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resClar = await fetch('/clarifications');
        const clarData = await resClar.json();
        const resObj = await fetch('/objections');
        const objData = await resObj.json();
        setClarifications(clarData);
        setObjections(objData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Chargement…</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Forum citoyen</h2>
      <h3>Clarifications</h3>
      {clarifications.length === 0 ? (
        <p>Aucune clarification.</p>
      ) : (
        clarifications.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <p>
              <strong>Proposition :</strong> {c.proposal_title || c.proposal_id}
            </p>
            <p>
              <strong>Question :</strong> {c.question}
            </p>
            <p>
              <strong>Réponse :</strong> {c.answer || '—'}
            </p>
          </div>
        ))
      )}
      <h3>Objections</h3>
      {objections.length === 0 ? (
        <p>Aucune objection.</p>
      ) : (
        objections.map((o) => (
          <div key={o.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <p>
              <strong>Proposition :</strong> {o.proposal_title || o.proposal_id}
            </p>
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