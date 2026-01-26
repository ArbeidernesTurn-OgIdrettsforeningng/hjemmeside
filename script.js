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

// News carousel functionality
function initNewsCarousel() {
  const carouselTrack = document.getElementById('news-carousel-track');
  const carouselContainer = document.getElementById('news-carousel');
  const prevBtn = document.getElementById('news-prev-btn');
  const nextBtn = document.getElementById('news-next-btn');
  const indicators = document.querySelectorAll('#news-carousel-indicators button');
  
  if (!carouselTrack) return;
  
  let currentSlide = 0;
  // Get only direct children (slide elements), not nested divs
  const slides = Array.from(carouselTrack.children).filter(child => 
    child.classList.contains('min-w-full')
  );
  const totalSlides = slides.length;
  
  function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update height based on actual content shown in current slide
    const currentSlideElement = slides[currentSlide];
    if (currentSlideElement && carouselContainer) {
      // Wait for transition to complete, then measure the slide container
      setTimeout(() => {
        // Get the news item (border-2 element) directly
        const newsItem = currentSlideElement.querySelector('.border-2');
        if (newsItem) {
          // Use offsetHeight to get the actual rendered height including padding and border
          const contentHeight = newsItem.offsetHeight;
          
          // Add a small buffer to ensure nothing is cut off (2px for safety)
          const totalHeight = contentHeight + 2;
          
          // Set height to exactly match the content shown
          if (totalHeight > 0) {
            carouselContainer.style.height = `${totalHeight}px`;
            carouselContainer.style.maxHeight = `${totalHeight}px`;
          } else {
            carouselContainer.style.height = 'auto';
            carouselContainer.style.maxHeight = 'none';
          }
        } else {
          // Fallback: measure the slide element itself
          const slideHeight = currentSlideElement.scrollHeight;
          if (slideHeight > 0) {
            carouselContainer.style.height = `${slideHeight + 2}px`;
            carouselContainer.style.maxHeight = `${slideHeight + 2}px`;
          }
        }
      }, 50); // Small delay to ensure layout is complete
    }
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.remove('bg-gray-400', 'hover:bg-gray-500');
        indicator.classList.add('bg-blue-600', 'hover:bg-blue-700');
      } else {
        indicator.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        indicator.classList.add('bg-gray-400', 'hover:bg-gray-500');
      }
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
  
  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
    });
  });
  
  // Initialize
  updateCarousel();
  
  // Update height on window resize
  window.addEventListener('resize', () => {
    setTimeout(updateCarousel, 100);
  });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadNavbar();
  loadFooter();
  initNewsCarousel();
}); 