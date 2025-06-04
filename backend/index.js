const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(' MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));
