const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');  
require('dotenv').config();
const path = require('path');
const MongoStore = require('connect-mongo');

const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,    
};
app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
app.use(express.json()); 

app.use(session({
  secret: 'hemligt',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', recipeRoutes);

app.get('/', (req, res) => {
    res.send('Servern är igång!');
  });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../recept/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../recept/build/index.html'));
  });
}
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
