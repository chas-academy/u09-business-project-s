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
    const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);

// hooks

  useEffect(() => {
  if (searchTerm.trim() === '') {
    setSearchResults([]);
  }
}, [searchTerm]);

  useEffect(() => {
    fetch('http://localhost:3000/auth/api/user', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
fetch('http://localhost:3000/api/recipes', { credentials: 'include' })
  .then(res => {
    if (!res.ok) {
      throw new Error('Ej auktoriserad');
    }
    return res.json();
  })
  .then(data => setApiRecipes(data))
  .catch(err => {
    console.error(err);
    setApiRecipes([]);
  });
  

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
    const handleSearch = () => {
    if (!searchTerm.trim()) return;

    fetch(`http://localhost:3000/api/search-recipes?query=${encodeURIComponent(searchTerm)}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setSearchResults(data))
      .catch(err => {
        console.error('Fel vid sökning:', err);
      });
  };
const handleLogout = () => {
  fetch('http://localhost:3000/auth/logout', {
    credentials: 'include'
  })
    .then(() => {
      setUser(null); // Ta bort användaren från state
    })
    .catch(err => console.error('Fel vid utloggning:', err));
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
    {user ? (
  <div>
    <p>Inloggad som {user.username || user.displayName || 'okänd användare'}</p>
    <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logga ut</button>
  </div>
) : (
  <Login />
)}


              <div style={{ margin: '1rem 0' }}>
                <input
                  type="text"
                  placeholder="Sök recept (t.ex. pasta, vegan...)"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ padding: '0.5rem', width: '200px' }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>
                  Sök
                </button>
              </div>

{searchResults.length > 0 && (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
    {searchResults.map(recipe => (
      <div key={recipe._id || recipe.spoonacularId} style={{ border: '1px solid #ccc', padding: '1rem', width: '250px' }}>
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
            {recipe._id && (
              <button
                onClick={() => deleteRecipe(recipe._id)}
                style={{ marginTop: '0.5rem', backgroundColor: 'red', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
              >
                Ta bort
              </button>
            )}
          </>
        )}
      </div>
    ))}
  </div>
)}
            </>
          } />
          <Route path="/sparade-recept" element={<SavedRecipes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;