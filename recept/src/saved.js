import React, { useEffect, useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function SavedRecipes({ user }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!user) {
      setRecipes([]);
      return;
    }

    fetch(`${apiUrl}/api/recipes`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Inloggning krävs');
        return res.json();
      })
      .then(data => setRecipes(data))
      .catch(err => {
        console.error('Fel vid hämtning av sparade recept:', err);
        setRecipes([]);
      });
  }, [user]);
//radera
 const deleteRecipe = (id) => {
    if (!window.confirm('Är du säker på att du vill ta bort detta recept?')) return;

    fetch(`${apiUrl}/api/recipes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
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
  <div className="recipe-container">
    {recipes.map((r) => (
      <div key={r._id} className="recipe-card">
        <h3>{r.title}</h3>
        <img src={r.image} alt={r.title} />
        <p dangerouslySetInnerHTML={{ __html: r.summary }}></p>
        <button onClick={() => deleteRecipe(r._id)} className="delete-button">
          Ta bort recept
        </button>
      </div>
    ))}
  </div>
</div>


  );
}

export default SavedRecipes;
