const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');
require('dotenv').config();

// --- ROUTE IMPORTS ---
const indexRouter = require('./routes/index');
const memesRouter = require('./routes/memes');
const memeRouter = require('./routes/meme');
const authRouter = require('./routes/auth');

const app = express();

// --- VIEW ENGINE SETUP ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- MIDDLEWARE ---
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- STATIC FILES ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));

// --- SESSION SETUP ---  
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --- GLOBAL VIEW VARIABLES  ---
app.use((req, res, next) => {
  res.locals.user = req.user || { username: 'Guest' };
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});


/**--- FETCH MEME DATA ---
 * @desc Fetches 20 memes from the API and stores them globally
 */
async function fetchAndStoreMemes() {
  try {
    const apiUrl = process.env.MEME_API_URL || 'http://jss.restapi.co.za/memes';
    const response = await axios.get(apiUrl);

    if (response.data && response.data.memes) {
      let memes = response.data.memes.map((meme, index) => ({
        ...meme,
        id: meme.id || index + 1,
      }));
      app.locals.memesCache = memes;
    } else { 
      app.locals.memesCache = [];
    }
  } catch (error) {
    console.error('Error fetching memes:', error.message); 
    app.locals.memesCache = []; 
  }
}

fetchAndStoreMemes();

// --- ROUTES ---
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/memes', memesRouter);
app.use('/meme', memeRouter);

// --- ERROR HANDLING ---
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
