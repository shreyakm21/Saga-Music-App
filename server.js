const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const ProfileModel = require('./models/Profile');
const Playlist = require('./models/Playlist');
const SongModel = require('./models/Song');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
//const PlaylistModel = require('./models/Playlist');

// Secret key for JWT (use environment variables for security)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//const upload = multer({ dest: 'uploads/' });

// Allow requests from the frontend
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Your frontend URL
  credentials: true
}));
//app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));


// Middleware to authenticate using JWT
function authenticateJWT(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token
  console.log('Received token:', token); // Debug: Log the received token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Decoded user data:', user); // Log decoded user data
    req.user = user;  // Store user data in request
    next();
  });
}

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/musicApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sign-up Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user without email
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Create a default profile for the user after registration
    const newProfile = new ProfileModel({
      userId: newUser._id,
      fullName: '',
      dob: '',
      bio: '',
      avatarUrl: ''
    });
    await newProfile.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Create a JWT token
    const token = jwt.sign({
      _id: user._id,
      username: user.username,
      playlists: user.playlists,
      profile: user.profile
    }, JWT_SECRET, { expiresIn: '1d' });  // Token expires in 1 day

    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route to get dashboard data
app.get('/dashboard-data', authenticateJWT, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.user._id });
    const playlists = await Playlist.find({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      username: req.user.username,
      playlists: playlists, // Include playlists 
      profile: {
        fullName: profile.fullName,
        dob: profile.dob,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route
app.post('/logout', (req, res) => {
  // Client will just delete the token
  res.status(200).json({ message: 'Logout successful' });
});

// Get profile
app.get('/profile', authenticateJWT, async (req, res) => {
  try {
    let profile = await ProfileModel.findOne({ userId: req.user._id });
    if (!profile) {
      // If no profile exists, create a new one
      profile = new ProfileModel({
        userId: req.user._id,
        fullName: '',
        dob: '',
        bio: '',
        avatarUrl: ''
      });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
app.post('/profile', authenticateJWT, async (req, res) => {
  try {
    const { fullName, dob, bio, avatarUrl } = req.body;

    let profile = await ProfileModel.findOne({ userId: req.user._id });
    if (profile) {
      profile.fullName = fullName;
      profile.dob = dob;
      profile.bio = bio;
      profile.avatarUrl = avatarUrl;
    } else {
      profile = new ProfileModel({
        userId: req.user._id,
        fullName,
        dob,
        bio,
        avatarUrl
      });
    }
    await profile.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
    }
  },
});

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Route to create a playlist
app.post('/create-playlist', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    // Handle Multer validation error
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    // Log the uploaded file and user
    console.log("Uploaded file:", req.file);
    console.log("Authenticated user:", req.user);
    console.log("Request body:", req.body);

    const { name, description } = req.body;

    // Ensure all required fields are present
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    // Handle the uploaded image
    const imagePath = req.file ? `/uploads/${req.file.filename}` : ''; // Get the uploaded image path
    console.log("Image path:", imagePath);

    // Create a new playlist in the database
    const newPlaylist = new Playlist({
      userId: req.user._id,  // Assuming userId is available in JWT
      name,
      description,
      imagePath,
    });

    // Save the playlist to the database
    await newPlaylist.save();

    // Respond with success
    res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Failed to create playlist. Please try again' });
  }
});

// Delete a playlist by ID
app.delete('/playlists/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the playlist to validate ownership
    const playlist = await Playlist.findOne({ _id: id, userId: req.user._id });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found or unauthorized" });
    }

    // Delete the playlist and its songs
    await Playlist.deleteOne({ _id: id });
    await SongModel.deleteMany({ playlistId: id });

    res.status(200).json({ message: "Playlist and associated songs deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ message: "Failed to delete playlist." });
  }
});


// Route to fetch playlist details
app.get('/playlists/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the playlist by ID and validate ownership
    const playlist = await Playlist.findOne({ _id: id, userId: req.user._id });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }

    // Fetch songs linked to this playlist
    const songs = await SongModel.find({ playlistId: id });

    // Return playlist details and associated songs
    res.json({
      playlist: {
        id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        imagePath: playlist.imagePath || null, // Fallback if no image
        songCount: songs.length, // Update song count dynamically
        songs: songs.map(song => ({
          id: song._id,
          name: song.name,
          artist: song.artist || 'Unknown Artist',
          album: song.album || 'Unknown Album',
          duration: song.duration || 'Unknown Duration',
          imagePath: song.imagePath || null,
          audioPath: song.audioPath || null,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    res.status(500).json({ message: 'Failed to fetch playlist details.' });
  }
});




// Ensure upload directories exist
const createUploadDirs = () => {
  const audioDir = path.join(__dirname, 'uploads', 'songs', 'audio');
  const imageDir = path.join(__dirname, 'uploads', 'songs', 'images');
  
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
};
createUploadDirs();

// Multer storage configuration
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('audio')) {
      cb(null, path.join(__dirname, 'uploads', 'songs', 'audio'));
    } else if (file.mimetype.startsWith('image')) {
      cb(null, path.join(__dirname, 'uploads', 'songs', 'images'));
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name
  }
});

// File filter for audio and image validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio')) {
    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (allowedAudioTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio file type. Only MP3, WAV, or OGG allowed'), false);
    }
  } else if (file.mimetype.startsWith('image')) {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Only JPEG, PNG, or GIF allowed'), false);
    }
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Multer upload middleware for handling both image and audio fields
const songUpload = multer({ storage: storage2, fileFilter });

// Route to add a new song
app.post('/add-song', authenticateJWT, songUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    // Ensure all required fields are present
    const { name, artist, album, duration, playlistId } = req.body;

    if (!name || !artist || !duration || !playlistId) {
      return res.status(400).json({ message: 'Name, artist, duration, and playlistId are required' });
    }

    // Get the file paths for the image and audio
    const imagePath = req.files && req.files.image ? `/uploads/songs/images/${req.files.image[0].filename}` : '';
    const audioPath = req.files && req.files.audio ? `/uploads/songs/audio/${req.files.audio[0].filename}` : '';

    // Create the song in the database
    const newSong = new SongModel({
      name,
      artist,
      album,
      duration,
      playlistId,
      imagePath,
      audioPath,
    });

    await newSong.save();

    // Update the playlist song count
    const playlist = await Playlist.findById(playlistId);
    if (playlist) {
      playlist.songCount += 1; // Increment the song count
      await playlist.save();
    }
  


    res.status(201).json({ message: 'Song added successfully', song: newSong });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ message: 'Failed to add song. Please try again' });
  }
});


// Route to delete a song from a playlist
app.delete('/playlists/:playlistId/songs/:songId', authenticateJWT, async (req, res) => {
  const { playlistId, songId } = req.params;

  try {
    // Check if the playlist exists and belongs to the user
    const playlist = await Playlist.findOne({ _id: playlistId, userId: req.user._id });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }

    // Find and remove the song from the playlist
    const song = await SongModel.findOneAndDelete({ _id: songId, playlistId: playlistId });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Update playlist song count
    playlist.songCount -= 1;
    await playlist.save();

    // Respond with a success message
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ message: 'Failed to delete song' });
  }
});



app.listen(3000, () => console.log('Server running on http://localhost:3000'));
