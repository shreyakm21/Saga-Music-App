const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String },
  album: { type: String },
  duration: { type: String },
  playlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true },
  imagePath: { type: String, required: false },  // Path for the album artwork image
  audioPath: { type: String, required: false },  // Path for the audio file (MP3, etc.)
});

const Song = mongoose.model('Song', SongSchema);
module.exports = Song;
