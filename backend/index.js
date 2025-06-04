const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const recipeRoutes = require('./routes/recipes');


const Recipe = require('./models/spoon');
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  


app.use(express.json());
app.use(require('cors')());
app.use('/api', recipeRoutes);

app.get('/', (req, res) => {
    res.send('Servern är igång!');
  });
  
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connected successfully');


    const testRecipe = new Recipe({
      title: 'Test Recept',
      image: 'https://via.placeholder.com/150',
      summary: 'Detta är ett testrecept',
      spoonacularId: 123456,
      diet: ['vegetarian']
    });

    testRecipe.save()
      .then(() => console.log('Testrecept sparat'))
      .catch(err => console.error('Fel vid sparande:', err));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });