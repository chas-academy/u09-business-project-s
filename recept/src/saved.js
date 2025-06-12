import React, { useEffect, useState } from 'react';


function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/recipes', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error('Fel vid hämtning av sparade recept:', err));
  }, []);
  useEffect(() => {
  fetch('http://localhost:3000/auth/api/user', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => console.log('Inloggad som:', data))
    .catch(err => console.error('Ej inloggad:', err));
}, []);

  return (
    <div>
      <h2>Mina sparade recept</h2>
      {recipes.length === 0 && <p>Inga recept sparade ännu.</p>}
      <ul>
        {recipes.map((r) => (
          <li key={r._id}>
            <h3>{r.title}</h3>
            <img src={r.image} alt={r.title} width="150" />
            <p dangerouslySetInnerHTML={{ __html: r.summary }}></p>
            <p><strong>Kost:</strong> {r.diet.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRecipes;
