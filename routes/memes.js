// Displays meme overview and handles search functionality

const express = require('express');
const router = express.Router();

/**
 * @route   GET /memes
 * @desc    Display meme overview page with optional search filtering
 * @access  Public (details hidden for unauthenticated users)
 */
router.get('/', (req, res, next) => {
  try {
    const allMemes = req.app.locals.memesCache || [];

    // Search functionality
    const rawQuery = req.query.search || '';
    const searchQuery = rawQuery.trim().toLowerCase();

    let filteredMemes = allMemes;
    if (searchQuery) {
      filteredMemes = allMemes.filter((meme) =>
        meme.name.toLowerCase().includes(searchQuery)
      );
    }

    // Add thumbnail size (20% of original width)
    filteredMemes = filteredMemes.map((meme) => ({
      ...meme,
      thumbWidth: Math.round(meme.width * 0.2),
    }));

    // Track viewed memes in session
    const viewedMemes = req.session.viewedMemes || {};
    req.session.viewedMemes = viewedMemes;

    const error = req.query.error || null;

    res.render('memes', {
      memes: filteredMemes,
      viewedMemes: req.session.viewedMemes,
      search: rawQuery,
      error,
    });
  } catch (err) {
    console.error('Error rendering memes page:', err);
    next(err);
  }
});

module.exports = router;
