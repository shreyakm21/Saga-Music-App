// Add event listeners for Edit and Delete buttons
playlistsContainer.addEventListener("click", async (event) => {
    const target = event.target;
    // Log which button was clicked
    console.log("Clicked target:", target);

    event.preventDefault();
    // Edit Playlist
    if (target.classList.contains("edit")) {
      console.log("Edit button clicked");

      const playlistId = target.dataset.playlistId;
      console.log("Playlist ID:", playlistId);

      const newName = prompt("Enter the new name for the playlist:");
      const newDescription = prompt("Enter the new description for the playlist:");

      if (newName && newDescription) {
        try {
          const editResponse = await fetch(`http://localhost:3000/playlists/${playlistId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              name: newName,
              description: newDescription
            })
          });

          if (!editResponse.ok) {
            throw new Error("Failed to update playlist");
          }

          alert("Playlist updated successfully!");

          // Update playlist name/description directly on the page
          const playlistCard = target.closest('.playlist-card');
          playlistCard.querySelector('h4').textContent = newName;
          playlistCard.querySelector('.description-container p').textContent = newDescription;
        } catch (error) {
          console.error("Error updating playlist:", error);
          alert(`Failed to update playlist. Error: ${error.message}`);
        }
      }
    }

    // Delete Playlist
    if (target.classList.contains("delete")) {
      console.log("Delete button clicked");

      const playlistId = target.dataset.playlistId;
      console.log("Playlist ID:", playlistId);
      if (!playlistId) {
        alert("Invalid playlist ID. Please try again.");
        window.location.href = 'dashboard.html'; // Redirect to the dashboard
        return;
      }

      const confirmed = confirm("Are you sure you want to delete this playlist?");
      if (confirmed) {
        try {
          const deleteResponse = await fetch(`http://localhost:3000/playlists/${playlistId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (!deleteResponse.ok) {
            if (deleteResponse.status === 404) {
              alert("Playlist not found. It may have already been deleted.");
              window.location.href = 'dashboard.html'; // Redirect if playlist not found
            } else {
              throw new Error("Failed to delete playlist");
            }
          }

          alert("Playlist deleted successfully!");

          // Remove the playlist card from the DOM
          const playlistCard = target.closest('.playlist-card');
          playlistCard.remove();
        } catch (error) {
          console.error("Error deleting playlist:", error);
          alert("Failed to delete playlist. Please try again.");
        }
      }
    }
  });