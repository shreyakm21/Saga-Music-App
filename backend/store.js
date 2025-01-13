// Update a playlist
app.put('/playlists/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    console.log("Edit playlist request received:", {
      playlistId: id,
      requestBody: req.body,
      userIdFromToken: req.user._id,
    });
  
    console.log("Edit playlist request received:", req.params.id);
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.user._id);
  
    try {
      console.log(`Update request for playlist ID: ${id}, User ID: ${req.user._id}`);
      console.log(`Request body: ${JSON.stringify({ name, description })}`);
  
      const playlist = await Playlist.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { name, description },
        { new: true }
      );
  
      if (!playlist) {
        console.log('Playlist not found or unauthorized');
        return res.status(404).json({ message: 'Playlist not found or unauthorized' });
      }
  
      res.json({ message: 'Playlist updated successfully', playlist });
    } catch (error) {
      console.error('Error updating playlist:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete a playlist
  app.delete('/playlists/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
  
    console.log("Delete playlist request received:", id);
    console.log("User ID from token:", req.user._id);
  
    try {
      // Validate the playlist ID format
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid playlist ID format');
        return res.status(400).json({ message: 'Invalid playlist ID' });
      }
  
      // Log request details
      console.log(`Attempting to delete playlist ID: ${id} for user ID: ${req.user._id}`);
  
      // Find and delete the playlist
      const playlist = await Playlist.findOneAndDelete({ _id: id, userId: req.user._id });
  
      if (!playlist) {
        console.log('Playlist not found or unauthorized');
        return res.status(404).json({ message: 'Playlist not found or unauthorized' });
      }
  
      console.log('Playlist deleted successfully:', playlist);
      res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });