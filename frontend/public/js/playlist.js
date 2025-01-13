document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('create-playlist-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const name = document.getElementById('playlist-name').value;
      const description = document.getElementById('playlist-description').value;
      const image = document.getElementById('playlist-image').files[0];
  
      if (!name || !description || !image) {
        alert('Please fill all fields');
        return;
      }
  
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);

    // Log formData to check if it's correct
    for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
    }

      try {
        const response = await fetch('http://localhost:3000/create-playlist', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Add token here
          },
        });
  
        const data = await response.json();
        if (response.ok) {
          alert('Playlist created successfully');
          window.location.href = '/dashboard.html'; // Redirect to dashboard after successful creation
        } else {
          alert(data.message || 'Failed to create playlist. Please try again');
        }
      } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist. Please try again');
      }
    });
  });
  