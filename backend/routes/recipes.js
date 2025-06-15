const express = require('express');
const router = express.Router();
const Recipe = require('../models/spoon');
const axios = require('axios');

router.get('/search-recipes', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Sökterm saknas' });
  }

  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        apiKey: process.env.SPOONACULAR_API_KEY,
        query,
        number: 10,
        addRecipeInformation: true
      }
    });
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Fel vid sökning', details: err.message });
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

  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Inloggning krävs' });
  }

  if (req.body._id) {
  delete req.body._id;
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
