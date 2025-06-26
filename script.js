// Load navbar from external file
function loadNavbar() {
  var navbarElement = document.getElementById('navbar');
  if (navbarElement) {
    fetch('/navbar')
      .then(response => response.text())
      .then(html => {
        navbarElement.innerHTML = html;
        // Initialize hamburger menu after navbar is loaded
        initHamburgerMenu();
      })
      .catch(error => {
        console.error('Error loading navbar:', error);
      });
  }
}

// Load footer from external file
function loadFooter() {
  var footerElement = document.getElementById('footer');
  if (footerElement) {
    fetch('/footer')
      .then(response => response.text())
      .then(html => {
        footerElement.innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading footer:', error);
      });
  }
}

// Hamburger menu functionality
function initHamburgerMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      console.log('Hamburger menu clicked!');
    });
  }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadNavbar();
  loadFooter();
}); 