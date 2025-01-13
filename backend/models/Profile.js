const mongoose = require('mongoose');

// Profile model
const Profile = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    fullName: String,
    dob: String,
    bio: String,        // A short bio for the user
    avatarUrl: String,  // Profile picture URL
  });
  
  const ProfileModel = mongoose.model('UserProfile', Profile);
  module.exports = ProfileModel;