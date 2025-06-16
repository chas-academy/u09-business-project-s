import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SavedRecipes from './saved';
import './App.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [apiRecipes, setApiRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetch(`${apiUrl}/auth/user`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/api/recipes`, { credentials: 'include' })
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
    fetch(`${apiUrl}/api/recipes`, {
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

    fetch(`${apiUrl}/api/search-recipes?query=${encodeURIComponent(searchTerm)}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setSearchResults(data))
      .catch(err => {
        console.error('Fel vid sökning:', err);
      });
  };

const handleLogout = () => {
  fetch(`${apiUrl}/auth/logout`, {
    credentials: 'include',
  })
    .then(res => {
      if (res.ok) {
        setUser(null);
        alert('Utloggad!');
      } else {
        throw new Error('Kunde inte logga ut');
      }
    })
    .catch(err => alert(err.message));
};
  const deleteRecipe = (id) => {
    fetch(`${apiUrl}/api/recipes/${id}`, {
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
         <nav className="navbar">
          <Link to="/">Hem</Link>
          <Link to="/sparade-recept" style={{ marginLeft: '1rem' }}>Mina recept</Link>
          <div>
            {user ? (
              <button onClick={handleLogout} className="auth-button">Logga ut</button>
            ) : (
              <a href={`${apiUrl}/auth/github`} className="auth-button"> Logga in med GitHub
</a>

            )}
          </div>
        </nav>
        {user && (
  <div className="user-info">
    Inloggad som {user.username || user.displayName || 'okänd användare'}
  </div>
)}
        <Routes>
          <Route path="/" element={
            <>
            <div style={{ margin: '1rem 0' }}>
            <input
              type="text"
              placeholder="(ex. pasta, vegan)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className='search-input'
            />
            <button onClick={handleSearch}className='search-button'>
              Sök
            </button>
            </div>
{searchResults.length > 0 && (
  <div className="recipe-container">
    {searchResults.map(recipe => (
      <div key={recipe._id || recipe.spoonacularId} className="recipe-card">
        <h2>{recipe.title}</h2>
        <img src={recipe.image} alt={recipe.title} />
        <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        {user && (
          <>
            <button onClick={() => saveRecipe(recipe)} className='save-button'>Spara recept</button>
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