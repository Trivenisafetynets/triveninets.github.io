document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const contactInfo = document.querySelector('.contact-info');

    // Hamburger toggle
    if (hamburger && navLinks && contactInfo) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling up
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            contactInfo.style.display = navLinks.classList.contains('active') ? 'none' : 'flex';
        });

        // Close menu when main nav links are clicked (exclude dropdown-menu links)
        navLinks.querySelectorAll('a').forEach(link => {
            // Check if the link is not inside a dropdown-menu
            if (!link.closest('.dropdown-menu')) {
                link.addEventListener('click', (e) => {
                    // If it's not the dropdown toggle link, close the menu
                    if (!link.parentElement.classList.contains('dropdown') || link.parentElement.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('active');
                        contactInfo.style.display = 'flex';
                    }
                });
            }
        });

        // Toggle Dropdown Menu on Mobile
        const dropdowns = navLinks.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');

            if (dropdownLink) {
                dropdownLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 767) {
                        e.stopPropagation(); // Prevent click from closing nav-links
                        if (!dropdown.classList.contains('active')) {
                            e.preventDefault(); // First click - open dropdown, prevent jump
                            // Close other open dropdowns
                            dropdowns.forEach(d => {
                                if (d !== dropdown) {
                                    d.classList.remove('active');
                                }
                            });
                            dropdown.classList.add('active');
                        } else {
                            // Second click - allow navigation and close menu
                            dropdown.classList.remove('active');
                            navLinks.classList.remove('active');
                            hamburger.classList.remove('active');
                            contactInfo.style.display = 'flex';
                        }
                    }
                });
            }

            // Close menu when clicking dropdown-menu links (matches reference site)
            const dropdownMenuLinks = dropdown.querySelectorAll('.dropdown-menu a');
            dropdownMenuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent click from bubbling up
                    // Close the parent menu and hamburger
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    contactInfo.style.display = 'flex';
                    // Close all dropdowns
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                    // Allow navigation to the link's href
                });
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                contactInfo.style.display = 'flex';
                // Close all dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    // === Hero Slideshow (index.html) ===
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide() {
        if (slides.length > 0) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[currentSlide].classList.add('active');
            currentSlide = (currentSlide + 1) % slides.length;
        }
    }

    if (slides.length > 0) {
        showSlide();
        setInterval(showSlide, 4000); // Change slide every 4 seconds
    }

    // === Contact Form Submission (contact.html) ===
    window.submitForm = function() {
        const name = document.querySelector('#name');
        const phone = document.querySelector('#phone');
        const order = document.querySelector('#order');
        const message = document.querySelector('#form-message');

        if (name && phone && order && message) {
            if (name.value && phone.value) {
                try {
                    // Prepare the message for WhatsApp
                    const wpMessageText = `Name: ${encodeURIComponent(name.value)}\nPhone: ${encodeURIComponent(phone.value)}\nOrder: ${encodeURIComponent(order.value || 'No order message provided')}`;
                    const wpMessage = `https://wa.me/+917093705662?text=${wpMessageText}`;

                    // Redirect to WhatsApp in the same tab
                    window.location.href = wpMessage;

                    // Show success message and clear the form
                    message.textContent = 'Redirecting to WhatsApp...';
                    message.style.color = 'var(--accent)';
                    name.value = '';
                    phone.value = '';
                    order.value = '';
                    setTimeout(() => {
                        message.textContent = '';
                    }, 5000);
                } catch (error) {
                    // Fallback if WhatsApp redirect fails
                    message.textContent = 'Failed to open WhatsApp. Please ensure WhatsApp is installed.';
                    message.style.color = '#ff4d4d';
                    console.error('WhatsApp Error:', error);
                }
            } else {
                // Show error if required fields are empty
                message.textContent = 'Please fill in all required fields (Name and Phone).';
                message.style.color = '#ff4d4d';
            }
        }
    };

    // === Smooth Scroll for Anchor Links (All Pages) ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === Image Loop (index.html) ===
    const loopContainer = document.querySelector('.loop-container');
    if (loopContainer) {
        loopContainer.style.animationPlayState = 'running';
    }

    // === Lightbox Gallery (index.html and gallery.html) ===
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImageIndex = 0;

    if (galleryImages.length > 0 && lightbox && lightboxImg) {
        // Open lightbox on image click
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                // Reset zoom animation
                lightboxImg.style.animation = 'none';
                setTimeout(() => {
                    lightboxImg.style.animation = 'zoomIn 0.3s ease forwards';
                }, 10);
            });
        });

        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }

        // Previous image
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                lightboxImg.src = galleryImages[currentImageIndex].src;
                // Reset zoom animation
                lightboxImg.style.animation = 'none';
                setTimeout(() => {
                    lightboxImg.style.animation = 'zoomIn 0.3s ease forwards';
                }, 10);
            });
        }

        // Next image
        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                lightboxImg.src = galleryImages[currentImageIndex].src;
                // Reset zoom animation
                lightboxImg.style.animation = 'none';
                setTimeout(() => {
                    lightboxImg.style.animation = 'zoomIn 0.3s ease forwards';
                }, 10);
            });
        }

        // Close lightbox on click outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    // === Animations (index.html) ===
    const shakeElements = document.querySelectorAll('.shake');
    const counts = document.querySelectorAll('.count');
    const barFills = document.querySelectorAll('.bar-fill');

    // Shake Animation on Scroll (for Our Services cards)
    function checkShake() {
        shakeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8 && !element.classList.contains('animate-shake')) {
                element.classList.add('animate-shake');
            }
        });
    }

    // Counter Animation (index.html - Milestone)
    function animateCounters() {
        counts.forEach(count => {
            const target = parseInt(count.getAttribute('data-count'));
            let current = 0;
            const increment = target / 100;
            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    count.textContent = Math.ceil(current);
                    setTimeout(updateCount, 10);
                } else {
                    count.textContent = target;
                }
            };
            const rect = count.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8 && !count.classList.contains('animated')) {
                count.classList.add('animated');
                updateCount();
            }
        });
    }

    // Percentage Bars Animation (index.html - Milestone)
    function animateBars() {
        barFills.forEach(bar => {
            const width = bar.getAttribute('data-width');
            const rect = bar.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8 && !bar.classList.contains('animated')) {
                bar.classList.add('animated');
                bar.style.width = width;
            }
        });
    }

    // Single Scroll Listener for Animations
    if (shakeElements.length > 0 || counts.length > 0 || barFills.length > 0) {
        window.addEventListener('scroll', () => {
            checkShake();
            animateCounters();
            animateBars();
        });
        // Initial check on page load
        checkShake();
        animateCounters();
        animateBars();
    }
});