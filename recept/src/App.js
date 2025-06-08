import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SavedRecipes from './saved';
import './App.css';

function Login() {
  return (
    <a
      href="http://localhost:3000/auth/github"
      style={{ display: 'inline-block', marginBottom: '1rem' }}
    >
      Logga in med GitHub
    </a>
  );
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/recipes', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error(err));
  }, []);

  const saveRecipe = () => {
    fetch('http://localhost:3000/api/fetch-recipe', { 
      method: 'GET',
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Inloggning krävs');
      return res.json();
    })
    .then(newRecipe => {
      setRecipes(prev => [newRecipe, ...prev]);
    })
    .catch(err => alert(err.message));
  };

  const deleteRecipe = (id) => {
    fetch(`http://localhost:3000/api/recipes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Recept kunde inte tas bort');
      setRecipes(prev => prev.filter(recipe => recipe._id !== id));
    })
    .catch(err => alert(err.message));
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Hem</Link> | <Link to="/sparade-recept">Mina recept</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              <h1>Recept</h1>
              {user ? (
                <p>Inloggad som {user.username || user.displayName || 'okänd användare'}</p>
              ) : (
                <Login />
              )}
              <button onClick={saveRecipe}>Spara recept</button>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {recipes.map(recipe => (
                  <div key={recipe._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '250px' }}>
                    <h2>{recipe.title}</h2>
                    <img src={recipe.image} alt={recipe.title} style={{ width: '100%' }} />
                    <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                    <button
                      onClick={() => deleteRecipe(recipe._id)}
                      style={{ marginTop: '1rem', backgroundColor: 'red', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
                    >
                      Ta bort
                    </button>
                  </div>
                ))}
              </div>
            </>
          } />
          <Route path="/sparade-recept" element={<SavedRecipes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
