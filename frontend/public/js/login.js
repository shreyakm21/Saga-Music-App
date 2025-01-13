document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  


  const username = event.target.username.value;
  const password = event.target.password.value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // Ensure credentials (cookies) are included with the request
    });

    const result = await response.json();

    if (response.ok) {
      // Extract token from response
      const { token } = result;  

      // Save the JWT token to localStorage
      localStorage.setItem('authToken', token);  // Make sure the token is sent by the backend in the response
      
      alert('Login Successful!');

      //window.location.href = 'dashboard.html';  // Redirect to the dashboard page after login
      // Redirect to dummy.html first
      window.location.href = 'dummy.html';

      // Wait for 2 seconds, then redirect to dashboard.html
      setTimeout(() => {
        window.location.href = 'dashboard.html';  // Redirect to the dashboard page after 2 seconds
      }, 2000); // Delay for 2 seconds to stay on dummy.html
    } else {
      alert(result.message); // Show error message as an alert if login fails
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
});

