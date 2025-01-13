const express = require('express');
const multer = require('multer');
const path = require('path');
const Playlist = require('./models/Playlist'); // Assuming you have a Playlist model
const User = require('./models/User'); // Assuming user is linked with playlist
const router = express.Router();
const authenticateJWT = require('./middleware/authenticateJWT');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Path where files will be stored
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// POST route to create playlist
router.post('/create-playlist', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;  // Path to image file

    if (!name || !description || !imagePath) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userId = req.user._id;  // User ID from JWT

    const playlist = new Playlist({
      name,
      description,
      imagePath,
      userId,
    });

    await playlist.save();

    // Add playlist to user's playlists array
    const user = await User.findById(userId);
    user.playlists.push(playlist._id);
    await user.save();

    res.status(201).json({ message: 'Playlist created successfully' });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Failed to create playlist. Please try again' });
  }
});



module.exports = router;
