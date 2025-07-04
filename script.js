// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen - only show on first visit
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited && loadingScreen) {
        // Mark as visited for this session
        sessionStorage.setItem('hasVisited', 'true');
        
        // Hide loading screen after 2 seconds
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    } else if (loadingScreen) {
        // Hide immediately if already visited
        loadingScreen.style.display = 'none';
    }
    
    // Navigation
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Scroll event for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active section in navbar
        highlightNavOnScroll();
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Touch events for better mobile interaction
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Portfolio Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }
    
    // Check fade elements on initial load
    checkFade();
    
    // Check fade elements on scroll
    window.addEventListener('scroll', debounce(checkFade, 15));
    
    // Typewriter effect for hero title
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typewriter effect after loading screen
        setTimeout(typeWriter, 2500);
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        if (hero) {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPosition = `50% ${scrollPosition * 0.05}px`;
        }
    });
    
    // Stats counter animation
    const statValues = document.querySelectorAll('.stat-value');
    let countersStarted = false;
    
    function startCounters() {
        if (countersStarted) return;
        
        statValues.forEach(stat => {
            const target = parseInt(stat.textContent, 10);
            if (!isNaN(target)) {
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = Math.ceil(target / (duration / 15));
                
                const counter = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        stat.textContent = target;
                        clearInterval(counter);
                    } else {
                        stat.textContent = count;
                    }
                }, 15);
            }
        });
        
        countersStarted = true;
    }
    
    // Start counters when about section is in view
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        window.addEventListener('scroll', function() {
            const aboutTop = aboutSection.getBoundingClientRect().top;
            if (aboutTop < window.innerHeight - 200) {
                startCounters();
            }
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = this.querySelector('[name="name"]').value;
            const email = this.querySelector('[name="email"]').value;
            const projectType = this.querySelector('[name="projectType"]').value;
            
            if (!name || !email || !projectType) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your inquiry! Kenzie will get back to you soon.');
                this.reset();
                submitButton.textContent = 'SUBMIT';
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Highlight active section in navbar based on scroll position
    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section');
        const navbarHeight = navbar.offsetHeight;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Debounce function to limit function calls
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Initialize ticker for awards section
    const ticker = document.querySelector('.ticker-content');
    if (ticker) {
        // Clone ticker items for continuous scrolling
        const tickerItems = ticker.innerHTML;
        ticker.innerHTML = tickerItems + tickerItems;
    }
    
    // Preload images for smoother experience
    function preloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const newImg = new Image();
                newImg.src = src;
            }
        });
    }
    
    preloadImages();
    
    // Modal functionality
    const modal = document.getElementById('contactModal');
    const bookNowBtn = document.getElementById('bookNowBtn');
    const heroBookNowBtn = document.getElementById('heroBookNowBtn');
    const closeBtn = document.querySelector('.close');
    
    // Function to open modal
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Open modal when Book Now button is clicked
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', openModal);
    }
    
    // Open modal when Hero Book Now button is clicked
    if (heroBookNowBtn) {
        heroBookNowBtn.addEventListener('click', openModal);
    }
    
    // Close modal when X button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
    
    // Log initialization
    console.log('Kenzie Hensen Portfolio - Initialized');
});