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
        // Initialize navbar scroll functionality after navbar is loaded
        setTimeout(function() {
          initNavbarScroll();
        }, 50);
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
  const navbar = document.getElementById('main-navbar');
  
  if (mobileMenuBtn && mobileMenu) {
    // Set mobile menu top position based on navbar height
    if (navbar) {
      const navbarHeight = navbar.offsetHeight;
      mobileMenu.style.top = navbarHeight + 'px';
    }
    
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      console.log('Hamburger menu clicked!');
    });
  }
  
  // Initialize Om oss dropdown
  initOmOssDropdown();
}

// Simple Om oss dropdown functionality
function initOmOssDropdown() {
  const dropdownContainer = document.querySelector('.om-oss-dropdown');
  const dropdownMenu = document.getElementById('om-oss-dropdown-menu');
  const arrowButton = document.getElementById('om-oss-arrow');
  
  if (!dropdownContainer || !dropdownMenu || !arrowButton) return;
  
  let isClickOpen = false;
  let hideTimeout;
  
  // Force close menu - always works
  const forceCloseMenu = function() {
    clearTimeout(hideTimeout);
    dropdownMenu.classList.add('hidden');
    dropdownMenu.style.display = 'none';
  };
  
  // Show menu
  const showMenu = function() {
    clearTimeout(hideTimeout);
    dropdownMenu.classList.remove('hidden');
    dropdownMenu.style.display = 'block';
  };
  
  // Hide on mouse leave (only if not clicked open)
  const hideMenu = function() {
    clearTimeout(hideTimeout);
    if (!isClickOpen) {
      hideTimeout = setTimeout(function() {
        // Check if mouse is still over container or menu
        const isOverContainer = dropdownContainer.matches(':hover');
        const isOverMenu = dropdownMenu.matches(':hover');
        if (!isOverContainer && !isOverMenu && !isClickOpen) {
          forceCloseMenu();
        }
      }, 150);
    }
  };
  
  // Ensure menu is closed on page load - FIRST THING
  forceCloseMenu();
  
  // Show on hover over container (only if not clicked open)
  dropdownContainer.addEventListener('mouseenter', function() {
    if (!isClickOpen) {
      showMenu();
    }
  });
  
  // Hide on mouse leave from container
  dropdownContainer.addEventListener('mouseleave', function(e) {
    // Check if mouse is moving to menu
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && (relatedTarget === dropdownMenu || dropdownMenu.contains(relatedTarget))) {
      // Mouse is moving to menu, don't hide
      return;
    }
    hideMenu();
  });
  
  // Keep menu open when hovering over menu
  dropdownMenu.addEventListener('mouseenter', function() {
    if (!isClickOpen) {
      showMenu();
    }
  });
  
  // Hide when mouse leaves menu
  dropdownMenu.addEventListener('mouseleave', hideMenu);
  
  // Toggle on arrow click
  arrowButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(hideTimeout);
    isClickOpen = !isClickOpen;
    if (isClickOpen) {
      showMenu();
    } else {
      forceCloseMenu();
    }
  });
  
  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (isClickOpen && !dropdownContainer.contains(e.target) && !dropdownMenu.contains(e.target)) {
      isClickOpen = false;
      forceCloseMenu();
    }
  });
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

// Klubbklær image carousel functionality
function initKlubbklaerCarousel() {
  const carouselTrack = document.getElementById('klubbklaer-carousel-track');
  const carouselContainer = document.getElementById('klubbklaer-carousel');
  const prevBtn = document.getElementById('klubbklaer-prev-btn');
  const nextBtn = document.getElementById('klubbklaer-next-btn');
  const indicators = document.querySelectorAll('#klubbklaer-carousel-indicators button');
  
  if (!carouselTrack) return;
  
  let currentSlide = 0;
  const slides = Array.from(carouselTrack.children).filter(child => 
    child.classList.contains('min-w-full')
  );
  const totalSlides = slides.length;
  
  function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
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
}

// Navbar scroll hide/show functionality
function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;
  
  // Set body padding based on navbar height to prevent content overlap
  function updateBodyPadding() {
    const navbarHeight = navbar.offsetHeight;
    document.body.style.paddingTop = navbarHeight + 'px';
  }
  
  // Update padding on load and resize
  updateBodyPadding();
  window.addEventListener('resize', updateBodyPadding);
  
  let lastScrollTop = 0;
  let scrollThreshold = 20; // Minimum scroll distance to trigger hide/show
  let ticking = false;
  let isHidden = false;
  
  function updateNavbar() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDelta = scrollTop - lastScrollTop;
    
    // Ignore bounce back effects - only process valid scroll positions
    // Check if scrollTop is within valid range (not negative, not beyond max scroll)
    if (scrollTop < 0 || scrollTop > maxScroll + 10) {
      ticking = false;
      return; // Ignore bounce back or overscroll
    }
    
    // Always show navbar at top of page
    if (scrollTop <= 10) {
      navbar.style.transform = 'translateY(0)';
      navbar.style.opacity = '1';
      isHidden = false;
      lastScrollTop = scrollTop;
      ticking = false;
      return;
    }
    
    // Only update if scrolled more than threshold
    if (Math.abs(scrollDelta) < scrollThreshold) {
      ticking = false;
      return;
    }
    
    // Only react to scrolling up if we're not at the very bottom (to prevent bounce back issues)
    const isNearBottom = scrollTop >= maxScroll - 50;
    
    if (scrollDelta > 0 && scrollTop > 50) {
      // Scrolling down - hide navbar gradually
      if (!isHidden) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.opacity = '0';
        isHidden = true;
      }
    } else if (scrollDelta < 0 && !isNearBottom) {
      // Scrolling up - show navbar gradually (but not if we're near bottom to avoid bounce back)
      if (isHidden) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
        isHidden = false;
      }
    }
    
    lastScrollTop = scrollTop;
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
  
  // Initialize navbar as visible
  navbar.style.opacity = '1';
  navbar.style.transform = 'translateY(0)';
}

// Match image height to text container height (for våre-trenere page)
function initTrainerImageHeight() {
  const textContainer = document.getElementById('text-container');
  const imageContainer = document.getElementById('image-container');
  const image = document.getElementById('trainer-image');
  
  if (!textContainer || !imageContainer || !image) return;
  
  function matchImageHeight() {
    if (window.innerWidth >= 1024) {
      const textHeight = textContainer.offsetHeight;
      imageContainer.style.height = textHeight + 'px';
      image.style.height = '100%';
    } else {
      imageContainer.style.height = 'auto';
      image.style.height = 'auto';
    }
  }
  
  // Run on load and resize
  matchImageHeight();
  window.addEventListener('resize', matchImageHeight);
  
  // Also run after a short delay to ensure content is rendered
  setTimeout(matchImageHeight, 100);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadNavbar();
  loadFooter();
  initNewsCarousel();
  initKlubbklaerCarousel();
  initTrainerImageHeight();
}); 