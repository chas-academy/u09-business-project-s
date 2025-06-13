import React, { useEffect, useState } from 'react';


function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
//hämta sparade
  useEffect(() => {
    fetch('http://localhost:3000/api/recipes', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error('Fel vid hämtning av sparade recept:', err));
  }, []);
//kolla auth
  useEffect(() => {
  fetch('http://localhost:3000/auth/api/user', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => console.log('Inloggad som:', data))
    .catch(err => console.error('Ej inloggad:', err));
}, []);
//radera
  const deleteRecipe = (id) => {
    if (!window.confirm('Är du säker på att du vill ta bort detta recept?')) return;

    fetch(`http://localhost:3000/api/recipes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Kunde inte ta bort recept');
        setRecipes(prev => prev.filter(r => r._id !== id));
      })
      .catch(err => alert(err.message));
  };
  return (
    <div>
      <h2>Sparade recept</h2>
      {recipes.length === 0 && <p>Inga recept sparade ännu.</p>}
      <ul>
        {recipes.map((r) => (
          <li key={r._id}>
            <h3>{r.title}</h3>
            <img src={r.image} alt={r.title} width="150" />
            <p dangerouslySetInnerHTML={{ __html: r.summary }}></p>
                        <button
              onClick={() => deleteRecipe(r._id)}
              style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              Ta bort recept
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRecipes;
