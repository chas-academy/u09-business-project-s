const express = require('express');
const router = express.Router();
const Recipe = require('../models/spoon');
const axios = require('axios');


function requireLogin(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Inloggning krävs' });
  }

router.get('/fetch-recipe', requireLogin, async (req, res) => {
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/random', {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          number: 1
        }
      });
      const r = response.data.recipes[0];

      const recipe = new Recipe({
        title: r.title,
        image: r.image,
        summary: r.summary,
        spoonacularId: r.id,
        diet: r.diets
      });
  
      await recipe.save();
      res.status(201).json(recipe);
    } catch (err) {
      res.status(500).json({ error: 'Något gick fel', details: err.message });
    }
  });
router.delete('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    res.status(200).json({ message: 'Recept borttaget' });
  } catch (err) {
    res.status(500).json({ error: 'Något gick fel vid borttagning' });
  }
});
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta recept' });
  }
});
router.post('/recipes', (req, res) => {
  console.log('POST /api/recipes');
  console.log('Cookies:', req.cookies);
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Is Authenticated:', req.isAuthenticated());

  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Inloggning krävs' });
  }

  const newRecipe = new Recipe(req.body);
  newRecipe.save()
    .then(saved => res.json(saved))
    .catch(err => {
      console.error('Mongoose error:', err);
      res.status(500).json({ error: 'Fel vid sparande', details: err.message });
    });
});


module.exports = router;
