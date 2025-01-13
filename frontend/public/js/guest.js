// Modal functionality
const modal = document.getElementById('login-modal');
const loginBtn = document.querySelector('.nav-links .btn');
const closeBtn = document.querySelector('.close-btn');

// Open the login modal when "Sign Up / Log In" is clicked
loginBtn.addEventListener('click', function (e) {
  e.preventDefault();
  modal.style.display = 'block';
});

// Close the modal when the close button (x) is clicked
closeBtn.addEventListener('click', function () {
  modal.style.display = 'none';
});

// Close the modal if the user clicks outside the modal content
window.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
