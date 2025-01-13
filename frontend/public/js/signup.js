document.getElementById('signupForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const username = event.target.username.value.trim();
  const password = event.target.password.value.trim();

  // Input validation
  if (!username || !password) {
    alert('Please fill out both username and password');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Signup Successful! Please log in.');
      window.location.href = 'login.html';
    } else {
      alert(result.message || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Network or server error:', error);
    alert('Something went wrong. Please try again later.');
  }
});
