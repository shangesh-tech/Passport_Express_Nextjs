require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('./lib/db');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
require('./passport');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore,
  cookie: { secure: false, httpOnly: true, sameSite: 'lax' }
}));
app.use(passport.initialize());
app.use(passport.session());

// --- Auth Routes ---
// Google OAuth
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get('/api/auth/callback/google',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => res.redirect('http://localhost:3000/auth/success')
);

// Local Signup (CORRECTED)
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const newUser = new User({ 
      email, 
      displayName: email.split('@')[0] // Use email prefix as display name
    });
    
    // Register user with passport-local-mongoose
    const user = await User.register(newUser, password);
    
    // Log in the newly created user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login after signup failed' });
      }
      res.json({ user: req.user });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Local Login (CORRECTED)
app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' });
      }
      res.json({ user: req.user });
    });
  })(req, res, next);
});

app.get('/auth/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication Failed' });
});

// User Profile & Logout
app.get('/api/user', (req, res) =>
  req.isAuthenticated() ? res.json({ user: req.user }) : res.status(401).json({ user: null })
);

app.post('/api/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// Start Server
app.listen(8080, () =>
  console.log(`Auth server running on ${process.env.BASE_URL}`)
);
