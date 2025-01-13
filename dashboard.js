document.addEventListener("DOMContentLoaded", async () => {
  const usernameElement = document.getElementById('username');
  const playlistsContainer = document.getElementById('playlists-container');
  const nameElement = document.getElementById('name');
  const avatarElement = document.getElementById('avatar');
  const dobElement = document.getElementById('dob');
  const bioElement = document.getElementById('bio');

  // Get JWT token from localStorage
  const token = localStorage.getItem('authToken');

  if (!token) {
    alert('You are not logged in!');
    window.location.href = 'login.html'; // Redirect to login if no token found
    return;
  }

  try {
    // Fetch user data from the server
    const response = await fetch('http://localhost:3000/dashboard-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add the token to Authorization header
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load dashboard data');
    }

    const { username, profile, playlists } = await response.json();

    // Set user profile data
    usernameElement.textContent = username;
    nameElement.textContent = profile.fullName || 'N/A';
    avatarElement.src = profile.avatarUrl || 'default-avatar.png';
    dobElement.textContent = profile.dob || 'N/A';
    bioElement.textContent = profile.bio || 'N/A';

    // Display playlists or a message if no playlists are available
    playlistsContainer.innerHTML = ''; // Clear existing playlists (if any)

    // Function to handle playlist deletion
    async function deletePlaylist(playlistId) {
      const confirmation = confirm("Are you sure you want to delete this playlist and all its songs?");
      if (!confirmation) return;

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:3000/playlists/${playlistId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete playlist");
        }

        alert("Playlist deleted successfully");
        window.location.reload(); // Reload the page to refresh the playlists
      } catch (error) {
        console.error("Error deleting playlist:", error);
        alert("Error deleting playlist. Please try again.");
      }
    }

    // Function to update song count dynamically
    async function updateSongCount(playlistId) {
      const token = localStorage.getItem("authToken");
      try {
        // Fetch playlist details by ID
        const response = await fetch(`http://localhost:3000/playlists/${playlistId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const { playlist } = await response.json();
        const songCount = playlist.songCount;
    
        // Find the correct playlist card and update the song count
        const playlistCard = document.querySelector(`[data-playlist-id="${playlistId}"]`);
        const songCountText = playlistCard.querySelector('.song-count');
        songCountText.textContent = `${songCount} ${songCount === 1 ? 'song' : 'songs'}`;
      } catch (error) {
        console.error('Error fetching playlist details:', error);
        alert('Failed to load playlist details');
      }
    }
    

    if (playlists.length === 0) {
      // If there are no playlists, display a message
      const noPlaylistsMessage = document.createElement('p');
      noPlaylistsMessage.textContent = "No available playlists";
      playlistsContainer.appendChild(noPlaylistsMessage);
    } else {
      // If playlists are available, create playlist cards
      playlists.forEach((playlist) => {
        updateSongCount(playlist._id); // Call this to update song count after page loads
        const playlistCard = document.createElement('div');
        playlistCard.classList.add('playlist-card');
        playlistCard.setAttribute('data-playlist-id', playlist._id); // Set data attribute for easy reference


        // Playlist Image
        const playlistImage = document.createElement('img');
        playlistImage.src = `http://localhost:3000${playlist.imagePath}`;
        playlistImage.alt = playlist.name;
        playlistImage.classList.add('playlist-image');
        playlistCard.appendChild(playlistImage);

        // Playlist Content
        const playlistContent = document.createElement('div');
        playlistContent.classList.add('playlist-card-content');

        const playlistName = document.createElement('h4');
        playlistName.textContent = playlist.name;
        playlistContent.appendChild(playlistName);

        const playlistDescription = document.createElement('p');
        playlistDescription.textContent = playlist.description;
        
        // Create a plus sign icon/button
        const plusButton = document.createElement('button');
        plusButton.textContent = '+'; // Add plus sign
        plusButton.classList.add('plus-button');
        plusButton.addEventListener('click', (e) => {
          e.stopPropagation();  // Prevent the click event from propagating to the playlistCard
          
          // Assuming the song ID is available, send the API request to add the song to the playlist
          /*const songId = 'hn'; // Replace with the actual songId you are adding
          fetch(`http://localhost:3000/playlists/${playlist._id}/songs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ songId })
          })
          .then(response => response.json())
          .then(updatedPlaylist => {
            // Update the song count in the current playlist card
            const songCountText = playlistCard.querySelector('.song-count');
            songCountText.textContent = `${updatedPlaylist.playlist.songs.length} ${updatedPlaylist.playlist.songs.length === 1 ? 'song' : 'songs'}`;
            // Optionally, show a success message or do further updates
            console.log(`Song added to playlist ${updatedPlaylist.playlist.name}`);
          })
          .catch(error => {
            console.error('Error adding song:', error);
          });*/

          // Navigate to the song page
          window.location.href = `song.html?playlistId=${playlist._id}`;
        });
        
        // Append the description and plus sign next to it
        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('description-container');
        descriptionContainer.appendChild(playlistDescription);
        descriptionContainer.appendChild(plusButton);
        
        playlistContent.appendChild(descriptionContainer);

        // Action Buttons
        const playlistActions = document.createElement('div');
        playlistActions.classList.add('playlist-actions');

        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.classList.add('play');
        playButton.addEventListener('click', (e) => {
          e.stopPropagation();  // Prevent the click event from propagating to the playlistCard
          console.log('Navigating to player.html with playlistId:', playlist._id);
          window.location.href = `player.html?id=${playlist._id}`; // Redirect to player page with playlist ID
        });
        playlistActions.appendChild(playButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.dataset.playlistId = playlist._id; // Assign dataset playlistId
        playlistActions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.dataset.playlistId = playlist._id; // Assign dataset playlistId
        deleteButton.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent click propagation to the card
          deletePlaylist(playlist._id); // Call the delete function
        });
        playlistActions.appendChild(deleteButton);

        playlistContent.appendChild(playlistActions);
        playlistCard.appendChild(playlistContent);

        // Display the number of songs or "No songs available"
        const songCount = playlist.songs && playlist.songs.length || playlist.songCount;
        const songCountText = document.createElement('p');
        songCountText.classList.add('song-count'); // Add a class to the song count for easy reference
        if (songCount > 0) {
          songCountText.textContent = `${playlist.songs.length} ${playlist.songs.length === 1 ? 'song' : 'songs'}`;
        } else {
          songCountText.textContent = 'No songs available';
        }
        playlistContent.appendChild(songCountText);

        // Click to navigate to playlist details page
        playlistCard.addEventListener('click', () => {
          window.location.href = `pd.html?id=${playlist._id}`;
        });
        playlistsContainer.appendChild(playlistCard);
      });
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    alert('Failed to load dashboard data. Please try again later.');
  }

  // Logout functionality
  document.getElementById('logout').addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Send the JWT token with logout request
        }
      });

      if (response.ok) {
        localStorage.removeItem('authToken'); // Remove the token after logout
        window.location.href = 'login.html'; // Redirect to login page after logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  });
});
