document.addEventListener('DOMContentLoaded', async () => {
  const profileForm = document.getElementById('profileForm');
  

  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('You need to be logged in to view or edit your profile.');
    window.location.href = '/login'; // Redirect to login page
    return; // Stop further execution
  }
  console.log('Token retrieved in profile.js:', token);  // Log token to verify it's correct

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

    const { username } = await response.json();  
    document.getElementById('username').value = username;
  } catch (error) {
    console.error("Error deleting playlist:", error);
    alert("Error deleting playlist. Please try again.");
  }


  // Fetch existing profile data
  async function fetchProfile() {
    try {
      const response = await fetch('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching profile: ${response.status}`);
      }

      const data = await response.json();

      // Populate form fields with the retrieved profile data
      //document.getElementById('username').value = data.username || '';
      document.getElementById('fullName').value = data.fullName || '';
      document.getElementById('dob').value = data.dob || '';
      document.getElementById('bio').value = data.bio || '';
      document.getElementById('avatarUrl').value = data.avatarUrl || '';
    } catch (error) {
      console.error(error);
      alert('Unable to fetch profile data. Please try again later.');
    }
  }

  // Update profile data
  async function updateProfile(event) {
    event.preventDefault();

    const profileData = {
      fullName: document.getElementById('fullName').value,
      dob: document.getElementById('dob').value,
      bio: document.getElementById('bio').value,
      avatarUrl: document.getElementById('avatarUrl').value,
    };

    try {
      const response = await fetch('http://localhost:3000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error updating profile');
      }

      alert(result.message || 'Profile updated successfully');
      // Optionally, refresh the profile data
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Unable to update profile. Please try again later.');
    }
  }

  // Load profile data on page load
  fetchProfile();

  // Add submit event listener
  profileForm.addEventListener('submit', updateProfile);
});
