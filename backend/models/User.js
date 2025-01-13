const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  /*playlists: [{ name: String }], // Optional, adjust based on your needs
  profile: {
    fullName: String,
    dateOfBirth: String
  }*/
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
});

module.exports = mongoose.model('User', userSchema);


