document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('You are not logged in!');
    window.location.href = 'login.html';
    return;
  }

  const playlistId = new URLSearchParams(window.location.search).get('id');
  if (!playlistId) {
    alert('Playlist ID not found');
    window.location.href = 'dashboard.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/playlists/${playlistId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to load playlist data');

    const { playlist } = await response.json();
    const songs = playlist.songs;

    if (!songs || songs.length === 0) {
      document.getElementById('song-card-container').innerHTML = '<p>No songs available</p>';
      return;
    }

    const audio = new Audio();
    let currentSongIndex = 0;
    let isPlaying = false;

    const progressBar = document.getElementById('progress-bar');
    const songImage = document.getElementById('song-image');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const playBtn = document.getElementById('play-btn');
    const durationText = document.getElementById('duration');

    function updateSongCard(index) {
      const song = songs[index];
      songImage.src = `http://localhost:3000${song.imagePath}`;
      songTitle.textContent = song.name;
      songArtist.textContent = `${song.artist}`;
    }

    function loadSong(index) {
      const song = songs[index];
      if (!song.audioPath) {
        alert('Audio path is missing.');
        return;
      }
      audio.src = `http://localhost:3000${song.audioPath}`;
      audio.load();
      updateSongCard(index);
    }

    const playSong = () => {
      if (!isPlaying) {
        audio.play()
          .then(() => {
            isPlaying = true;
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          })
          .catch(err => console.error('Audio play error:', err));
      }
    };

    const pauseSong = () => {
      audio.pause();
      isPlaying = false;
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    };

    // Update progress bar
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;

        const formatTime = time => new Date(time * 1000).toISOString().substr(14, 5);
        durationText.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
      }
    });

    // Seek song
    progressBar.addEventListener('input', (e) => {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    });

    // Button event listeners
    playBtn.addEventListener('click', () => {
      isPlaying ? pauseSong() : playSong();
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      loadSong(currentSongIndex);
      if (isPlaying) playSong();
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      loadSong(currentSongIndex);
      if (isPlaying) playSong();
    });

    // Initialize the first song
    loadSong(currentSongIndex);
  } catch (error) {
    console.error('Error loading playlist:', error);
    alert('Failed to load playlist.');
  }
});
