import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error(err));
  }, []);
  console.log(recipes);

  return (
    <div className="App">
      <h1>Recept</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {recipes.map(recipe => (
          <div key={recipe._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '250px' }}>
            <h2>{recipe.title}</h2>
            <img src={recipe.image} alt={recipe.title} style={{ width: '100%' }} />
            <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
