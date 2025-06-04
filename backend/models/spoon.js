const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  summary: String,
  spoonacularId: Number,
  diet: [String]
});
module.exports = mongoose.model('Recipe', recipeSchema);
