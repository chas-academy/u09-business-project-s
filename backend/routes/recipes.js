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

router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta recept' });
  }
});

module.exports = router;
