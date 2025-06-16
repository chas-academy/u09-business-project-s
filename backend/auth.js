const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

const router = express.Router();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
callbackURL: process.env.GITHUB_CALLBACK,
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
res.redirect(process.env.FRONTEND_URL || 'http://localhost:3001');
  });

router.get('/auth/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: 'Kunde inte logga ut' });
      res.clearCookie('connect.sid');
    });
  });
});

router.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Ej inloggad' });
  }
});


module.exports = router;
