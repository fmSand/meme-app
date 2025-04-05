// Handles user authentication, login, logout, and signup routes

const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');
const path = require('path');

/** 
 * @desc     Load all users from the users.json file
 * @returns  {Array} Array of user objects
 */
function loadUsers() {
  const usersPath = path.join(__dirname, '../data/users.json');
  return JSON.parse(fs.readFileSync(usersPath, 'utf8'));
}

// --- PASSPORT CONFIG ---
passport.use(
  new LocalStrategy((username, password, done) => {
    try {
      const users = loadUsers();
      const user = users.find((user) => user.username === username);
      if (!user || user.password !== password) {
        return done(null, false, { message: 'Invalid username or password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  try {
    const users = loadUsers();
    const user = users.find((u) => u.username === username);
    if (!user) return done(new Error('User not found'));
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// --- AUTH ROUTES ---

/**
 * @desc   Show login form. Redirect if already logged in
 * @route  GET /auth/login
 */
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/memes');
  }
  res.render('login', {
    message: req.query.message || '',
  });
});

/**
 * @desc   Authenticate user and create session
 * @route  POST /auth/login
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log('Login attempt for:', req.body.username);
    if (err) return next(err);

    if (!user) {
      return res.render('login', {
        message: info.message
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/memes');
    });
  })(req, res, next); // (Invoke middleware)
});


/**
 * @desc   Log out user and redirect to memes page
 * @route  GET /auth/logout
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/memes');
  });
});


// --- SIGNUP ROUTES ---

/**
 * @desc   Show signup form. Redirect if already logged in
 * @route  GET /auth/signup
 */
router.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/memes');
  }
  res.render('signup', {
    message: '',
  });
});

/**
 * @desc   Create new user and redirect to login
 * @route  POST /auth/signup
 */
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  try {
    const usersPath = path.join(__dirname, '../data/users.json');
    const currentUsers = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

    const existingUser = currentUsers.find((u) => u.username === username); //
    if (existingUser) {
      return res.render('signup', {
        message: 'User already exists',
      });
    }

    const newUser = { username, password };
    currentUsers.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(currentUsers, null, 2));

    res.redirect(
      '/auth/login?message=Account created successfully. Please log in.'
    );
  } catch (err) {
    console.error('Signup error:', err);
    res.render('signup', {
      message: 'Error creating account. Please try again.',
    });
  }
});

module.exports = router;
