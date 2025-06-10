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
  const [apiRecipes, setApiRecipes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/auth/api/user', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/api/recipes', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setApiRecipes(data))
      .catch(err => console.error(err));
  }, []);

  const saveRecipe = (recipe) => {
    fetch('http://localhost:3000/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(recipe),
    })
      .then(res => {
        if (!res.ok) throw new Error('Inloggning krävs för att spara');
        return res.json();
      })
      .then(() => {
        alert('Recept sparat!');
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
        setApiRecipes(prev => prev.filter(recipe => recipe._id !== id));
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

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {apiRecipes.map(recipe => (
                  <div key={recipe._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '250px' }}>
                    <h2>{recipe.title}</h2>
                    <img src={recipe.image} alt={recipe.title} style={{ width: '100%' }} />
                    <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                    {user && (
                      <>
                        <button
                          onClick={() => saveRecipe(recipe)}
                          style={{ marginTop: '0.5rem', backgroundColor: 'green', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
                        >
                          Spara recept
                        </button>
                        <button
                          onClick={() => deleteRecipe(recipe._id)}
                          style={{ marginTop: '0.5rem', backgroundColor: 'red', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
                        >
                          Ta bort
                        </button>
                      </>
                    )}
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
