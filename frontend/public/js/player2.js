/*// Get the song information from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const songId = urlParams.get('id');
const songName = urlParams.get('name');
const songArtist = urlParams.get('artist');
const songImage = urlParams.get('image');
const audioUrl = urlParams.get('audio');
console.log('Audio URL:', audioUrl);

// Update the player UI with the song details
document.getElementById('song-title').textContent = songName;
document.getElementById('song-artist').textContent = songArtist;
//document.getElementById('song-image').src = `https://www.jamendo.com/get/album/thumb/cover/1000/500/${songId}.jpg`; // Assuming the album cover link
document.getElementById('song-image').src = songImage || 'placeholder.jpg';

// Set up the audio player
const audioPlayer = new Audio(audioUrl);
// Check if the audio URL is available
if (audioUrl) {
  audioPlayer.src = audioUrl; // Set the audio source if available
} else {
  alert('Audio preview not available for this song.'); // Show alert if audio is not available
}


let isPlaying = false;

// Play/pause functionality
document.getElementById('play-btn').addEventListener('click', () => {
  if (isPlaying) {
    audioPlayer.pause();
    document.getElementById('play-btn').innerHTML = '<i class="fa-solid fa-play"></i>';
  } else {
    audioPlayer.play();
    document.getElementById('play-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
  isPlaying = !isPlaying;
});

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  document.getElementById('progress-bar').value = progress;
  const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
  const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
  const totalMinutes = Math.floor(audioPlayer.duration / 60);
  const totalSeconds = Math.floor(audioPlayer.duration % 60);
  document.getElementById('duration').textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
});

// Handle progress bar changes
document.getElementById('progress-bar').addEventListener('input', (e) => {
  const progress = e.target.value;
  audioPlayer.currentTime = (audioPlayer.duration * progress) / 100;
});*/

// Get the song information from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const songId = urlParams.get('id');
const songName = urlParams.get('name');
const songArtist = urlParams.get('artist');
const songImage = urlParams.get('image');
const audioUrl = urlParams.get('audio');
console.log('Audio Preview URL:', audioUrl);  // Now it should print the actual URL

// Update the player UI with the song details
document.getElementById('song-title').textContent = songName;
document.getElementById('song-artist').textContent = songArtist;
document.getElementById('song-image').src = songImage || 'placeholder.jpg';

// Set up the audio player
const audioPlayer = new Audio(audioUrl);

// Check if the audio URL is available
if (audioUrl) {
  audioPlayer.src = audioUrl;  // Set the audio source if available
} else {
  alert('Audio preview not available for this song.');  // Show alert if audio is not available
}

let isPlaying = false;

// Play/pause functionality
document.getElementById('play-btn').addEventListener('click', () => {
  if (isPlaying) {
    audioPlayer.pause();
    document.getElementById('play-btn').innerHTML = '<i class="fa-solid fa-play"></i>';
  } else {
    audioPlayer.play();
    document.getElementById('play-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
  isPlaying = !isPlaying;
});

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  document.getElementById('progress-bar').value = progress;
  const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
  const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
  const totalMinutes = Math.floor(audioPlayer.duration / 60);
  const totalSeconds = Math.floor(audioPlayer.duration % 60);
  document.getElementById('duration').textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
});

// Handle progress bar changes
document.getElementById('progress-bar').addEventListener('input', (e) => {
  const progress = e.target.value;
  audioPlayer.currentTime = (audioPlayer.duration * progress) / 100;
});

// Download functionality for the song
document.getElementById('download-btn').addEventListener('click', () => {
  if (audioUrl) {
    // Create an invisible download link and trigger it
    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl;  // Set the audio file URL
    downloadLink.download = `${songName} - ${songArtist}.mp3`;  // Set the file name
    downloadLink.click();  // Trigger the download
  } else {
    alert('Audio preview is not available for download.');
  }
});