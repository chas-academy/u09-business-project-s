const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const Recipe = require('./models/spoon');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(require('cors')());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(' MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

