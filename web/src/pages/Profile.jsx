import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [proposals, setProposals] = useState([]);
  const [clarifications, setClarifications] = useState([]);
  const [objections, setObjections] = useState([]);

  useEffect(() => {
    // Récupérer les propositions (via flux FAST pour l'instant)
    fetch('https://abilden-api.onrender.com/proposals/fast')
      .then((res) => res.json())
      .then((data) => setProposals(data))
      .catch((err) => console.error(err));
    // Récupérer toutes les clarifications
    fetch('https://abilden-api.onrender.com/clarifications')
      .then((res) => res.json())
      .then((data) => setClarifications(data))
      .catch((err) => console.error(err));
    // Récupérer toutes les objections
    fetch('https://abilden-api.onrender.com/objections')
      .then((res) => res.json())
      .then((data) => setObjections(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon profil</h1>
      <p className="mb-4">
        Cette page présentera vos propositions, vos demandes de clarifications et vos
        objections. Les données sont actuellement des exemples.
      </p>
      <div>
        <h2 className="text-xl font-semibold mt-4">Mes propositions</h2>
        {proposals.length === 0 ? (
          <p className="text-gray-500">Aucune proposition pour l'instant.</p>
        ) : (
          proposals.map((p) => (
            <div key={p.id} className="border p-2 my-2 rounded">
              <h3 className="font-semibold">{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mt-4">Mes clarifications</h2>
        {clarifications.length === 0 ? (
          <p className="text-gray-500">Aucune clarification pour l'instant.</p>
        ) : (
          clarifications.map((c) => (
            <div key={c.id} className="border p-2 my-2 rounded">
              <p>{c.question}</p>
              {c.answer && (
                <p className="text-gray-500">Réponse : {c.answer}</p>
              )}
            </div>
          ))
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mt-4">Mes objections</h2>
        {objections.length === 0 ? (
          <p className="text-gray-500">Aucune objection pour l'instant.</p>
        ) : (
          objections.map((o) => (
            <div key={o.id} className="border p-2 my-2 rounded">
              <p>{o.description}</p>
              {o.suggested_change && (
                <p className="text-gray-500">
                  Amélioration suggérée : {o.suggested_change}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
