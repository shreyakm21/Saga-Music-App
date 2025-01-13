const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: false }, // If you're using file upload, store the image path here
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Reference to Song documents
  /*songs: [
    {
      name: { type: String },
      duration: { type: String } // Just a placeholder, can be modified later to store proper song data
    }
  ]*/
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = Playlist;
