// Routes related to individual meme viewing and tracking

const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

/**
 * @desc   Records that a meme has been viewed by the user (session-based)
 * @route  POST /meme/track-viewed-meme
 * @access Private
 */
router.post('/track-viewed-meme', ensureAuthenticated, (req, res, next) => {
  try {
    const memeData = req.body; // From client (/js/meme.js)
    const memeId = parseInt(memeData.id, 10);

    const viewedMemes = req.session.viewedMemes || {};
    viewedMemes[memeId] = true;
    req.session.viewedMemes = viewedMemes;

    res.redirect(`/meme/${memeId}`);
  } catch (err) {
    next(err);
  }
});

/**
 * @desc   Displays detailed information for a selected meme
 * @route  GET /meme/:id
 * @access Private
 */
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  try {
    const memeId = parseInt(req.params.id, 10);
    const memesCache = req.app.locals.memesCache;

    // If memes have not been loaded yet
    if (!memesCache || memesCache.length === 0) {
      return res.redirect('/memes?error=notloaded');
    }

    const meme = memesCache.find((m) => m.id === memeId);

    if (!meme) {
      const err = new Error('Meme not found');
      err.status = 404;
      return next(err);
    }

    res.render('meme', {
      meme: meme,
      title: `Meme Details - ${meme.name}`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
