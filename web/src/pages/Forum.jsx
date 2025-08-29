import React, { useEffect, useState } from 'react';

export default function Forum() {
  const [clarifications, setClarifications] = useState([]);
  const [objections, setObjections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clarRes = await fetch('https://abilden-api.onrender.com/clarifications');
        const clarData = await clarRes.json();
        setClarifications(clarData);
        const objRes = await fetch('https://abilden-api.onrender.com/objections');
        const objData = await objRes.json();
        setObjections(objData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Forum citoyen</h1>
      <h2 className="font-bold mt-4">Clarifications</h2>
      {clarifications.map((c) => (
        <div key={c.id} className="p-2 border-b">
          <p><strong>Proposition:</strong> {c.proposal_id}</p>
          <p><strong>Question:</strong> {c.question}</p>
          {c.answer && <p><strong>Réponse:</strong> {c.answer}</p>}
        </div>
      ))}
      <h2 className="font-bold mt-4">Objections</h2>
      {objections.map((o) => (
        <div key={o.id} className="p-2 border-b">
          <p><strong>Proposition:</strong> {o.proposal_id}</p>
          <p><strong>Description:</strong> {o.description}</p>
          <p><strong>Suggestion:</strong> {o.suggested_change}</p>
          <p><strong>Status:</strong> {o.status}</p>
        </div>
      ))}
    </div>
  );
}
