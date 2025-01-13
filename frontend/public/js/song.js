document.getElementById('add-song-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('You are not logged in!');
        window.location.href = 'login.html';
        return;
    }

    const playlistId = new URLSearchParams(window.location.search).get('playlistId');
    if (!playlistId) {
        alert('Playlist ID not found.');
        return;
    }
    const formData = new FormData();
    formData.append('name', document.getElementById('song-name').value);
    formData.append('artist', document.getElementById('artist-name').value);
    formData.append('duration', document.getElementById('song-duration').value);
    formData.append('image', document.getElementById('song-image').files[0]);
    formData.append('audio', document.getElementById('song-audio').files[0]);
    formData.append('playlistId', playlistId);

    try {
        const response = await fetch('http://localhost:3000/add-song', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Playlist ID:", playlistId);
            alert('Song added successfully!');
            //window.location.href = `pd.html?id=${playlistId}`;
            window.location.href = 'dashboard.html';
            
        } else {
            alert(result.message || 'Failed to add song');
        }
    } catch (error) {
        console.error('Error adding song:', error);
        alert('Failed to add song. Please try again.');
    }
});
