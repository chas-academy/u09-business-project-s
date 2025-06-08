const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./auth');


const Recipe = require('./models/spoon');
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  app.use(session({
    secret: 'hemligt',  
    resave: false,
    saveUninitialized: false,
  }));
  
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use(express.json());
app.use(require('cors')());
app.use('/api', recipeRoutes);
app.use('/api', recipeRoutes);

app.get('/', (req, res) => {
    res.send('Servern är igång!');
  });
  
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });