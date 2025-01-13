// Backend - PUT route for updating a playlist
const express = require('express');
const Playlist = require('../models/Playlist');
const router = express.Router();
const User = require('./models/User'); // Assuming user is linked with playlist
const authenticateJWT = require('./middleware/authenticateJWT');


// Update playlist
router.put('/playlists/:id', authenticateJWT, async (req, res) => {
  try {
    const { name, description } = req.body;
    const playlistId = req.params.id;

    // Find playlist by ID and update
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { name, description },
      { new: true } // Return the updated playlist
    );

    if (!updatedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ message: 'Failed to update playlist' });
  }
});

// Delete playlist
router.delete('/playlists/:id', authenticateJWT, async (req, res) => {
    try {
      const playlistId = req.params.id;
  
      // Find playlist by ID and delete
      const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  
      if (!deletedPlaylist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
  
      res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      res.status(500).json({ message: 'Failed to delete playlist' });
    }
  });

module.exports = router;
