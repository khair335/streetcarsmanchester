
document.addEventListener('DOMContentLoaded', function () {
    // Initialize MediaElement.js
    var player = new MediaElementPlayer('airport-video', {
        features: ['playpause', 'current', 'progress', 'duration', 'volume', 'fullscreen'],
        stretching: 'responsive',
        videoWidth: '100%',
        videoHeight: '100%',
        enableAutosize: true,
        hideVideoControlsOnLoad: false,
        pauseOtherPlayers: true,
        success: function (media, node, instance) {
            // Custom styling for the player
            var playerContainer = node.parentNode;
            playerContainer.classList.add('mejs-custom-player');

            // Hide default MediaElement.js overlay
            var defaultOverlay = playerContainer.querySelector('.mejs__overlay');
            var defaultOverlayButton = playerContainer.querySelector('.mejs__overlay-button');
            if (defaultOverlay) {
                defaultOverlay.style.display = 'none';
            }
            if (defaultOverlayButton) {
                defaultOverlayButton.style.display = 'none';
            }

            // Add custom play button overlay
            var playOverlay = document.createElement('div');
            playOverlay.className = 'mejs-play-overlay';
            // playOverlay.innerHTML = '<div class="play-button"><i class="ti ti-control-play"></i></div>';
            playerContainer.appendChild(playOverlay);

            // Handle play overlay click
            playOverlay.addEventListener('click', function () {
                if (media.paused) {
                    media.play();
                    playOverlay.style.display = 'none';
                } else {
                    media.pause();
                    playOverlay.style.display = 'flex';
                }
            });

            // Show overlay when video ends or is paused
            media.addEventListener('pause', function () {
                playOverlay.style.display = 'flex';
            });

            media.addEventListener('play', function () {
                playOverlay.style.display = 'none';
            });

            media.addEventListener('ended', function () {
                playOverlay.style.display = 'flex';
            });

            // Custom control styling
            setTimeout(function () {
                var controls = playerContainer.querySelector('.mejs-controls');
                if (controls) {
                    controls.style.background = 'linear-gradient(135deg, #62b0e0, #9b52aa)';
                    controls.style.height = '50px';
                    controls.style.padding = '0 15px';
                }

                // Style time rail
                var timeRail = playerContainer.querySelector('.mejs-time-rail');
                if (timeRail) {
                    var timeTotal = timeRail.querySelector('.mejs-time-total');
                    var timeCurrent = timeRail.querySelector('.mejs-time-current');
                    var timeHandle = timeRail.querySelector('.mejs-time-handle');

                    if (timeTotal) timeTotal.style.background = 'rgba(255, 255, 255, 0.5)';
                    if (timeCurrent) timeCurrent.style.background = '#ffd700';
                    if (timeHandle) {
                        timeHandle.style.background = '#ffd700';
                        timeHandle.style.border = '2px solid white';
                    }
                }

                // Style volume controls
                var volumeButton = playerContainer.querySelector('.mejs-volume-button');
                if (volumeButton) {
                    var volumeSlider = volumeButton.querySelector('.mejs-volume-slider');
                    if (volumeSlider) {
                        var volumeTotal = volumeSlider.querySelector('.mejs-volume-total');
                        var volumeCurrent = volumeSlider.querySelector('.mejs-volume-current');

                        if (volumeTotal) volumeTotal.style.background = 'rgba(255, 255, 255, 0.5)';
                        if (volumeCurrent) volumeCurrent.style.background = '#ffd700';
                    }
                }
            }, 100);
        }
    });

    // Fleet Section Scroll Animation
    function initFleetScrollAnimation() {
        const fleetBackground = document.getElementById('fleet-background');
        if (!fleetBackground) return;

        let ticking = false;
        let lastScrollY = window.pageYOffset;

        function updateFleetTransform() {
            const rect = fleetBackground.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionTop = rect.top;
            const sectionHeight = rect.height;

            // Calculate how much the section is visible
            const visiblePercentage = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));

            // Calculate transform based on scroll position with easing
            const maxTransform = 400; // Maximum transform distance in pixels
            const easeInOut = visiblePercentage * visiblePercentage * (3 - 2 * visiblePercentage); // Smooth easing
            const transformY = -(easeInOut * maxTransform) + 0;

            // Apply smooth transform with hardware acceleration
            fleetBackground.style.transform = `translate3d(0px, ${transformY}px, 0px)`;

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateFleetTransform);
                ticking = true;
            }
        }

        function onScroll() {
            lastScrollY = window.pageYOffset;
            requestTick();
        }

        // Add scroll event listener with throttling for better performance
        let scrollTimeout;
        window.addEventListener('scroll', function () {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(onScroll, 8); // Reduced timeout for smoother animation
        }, { passive: true });

        // Handle resize events
        window.addEventListener('resize', function () {
            updateFleetTransform();
        }, { passive: true });

        // Initial call
        updateFleetTransform();
    }

    // Initialize fleet scroll animation
    initFleetScrollAnimation();

    // Scroll Animation Functionality
    function initScrollAnimations() {
        const sections = [
            { element: document.querySelector('.video-container'), threshold: 0.1 },
            { element: document.querySelector('.section-1'), threshold: 0.2 },
            { element: document.querySelector('.airport-transfer-section'), threshold: 0.2 },
            { element: document.querySelector('.book-card'), threshold: 0.2 }
        ];

        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers that don't support IntersectionObserver
            sections.forEach(section => {
                if (section.element) {
                    section.element.classList.add('animate-in');
                }
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class
                    entry.target.classList.add('animate-in');

                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe each section
        sections.forEach(section => {
            if (section.element) {
                observer.observe(section.element);
            }
        });
    }

    // Initialize scroll animations
    initScrollAnimations();

    // Mobile Menu Functionality
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mobileMenuList = document.getElementById('mobile-menu-list');
        const mobileSubmenus = document.querySelectorAll('.mobile-submenu');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
        const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenuOverlay.classList.add('active');
            mobileMenuToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close mobile menu
        mobileMenuClose.addEventListener('click', function () {
            mobileMenuOverlay.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
            // Reset to main menu
            resetMobileMenu();
        });

        // Close menu when clicking overlay
        mobileMenuOverlay.addEventListener('click', function (e) {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
                resetMobileMenu();
            }
        });

        // Handle submenu navigation
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const menuItem = this.closest('.mobile-menu-item');
                const submenu = menuItem.querySelector('.mobile-submenu');

                if (submenu) {
                    e.preventDefault();
                    showSubmenu(submenu);
                }
            });
        });

        // Handle back button in submenus
        mobileSubmenus.forEach(submenu => {
            const backLink = submenu.querySelector('.mobile-submenu-back a');
            if (backLink) {
                backLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    hideSubmenu(submenu);
                });
            }
        });

        function showSubmenu(submenu) {
            // Animate out other menu items
            const menuItems = mobileMenuList.querySelectorAll('.mobile-menu-item');
            menuItems.forEach(item => {
                if (item !== submenu.closest('.mobile-menu-item')) {
                    item.classList.add('hide');
                }
            });
            const menuLinkItems = document.querySelector('.mobile-menu-nav');
            menuLinkItems.classList.add('menu-open');
            

            // Show submenu with animation
            setTimeout(() => {
                submenu.style.display = 'block';
                // Trigger animation by adding active class
                requestAnimationFrame(() => {
                    submenu.classList.add('active');
                });
            }, 100); // Wait for other items to animate out
        }

        function hideSubmenu(submenu) {
            // Animate out submenu
            submenu.classList.remove('active');

            // Wait for animation to complete, then hide and show main menu
            setTimeout(() => {
                submenu.style.display = 'none';

                // Show all menu items with animation
                const menuItems = mobileMenuList.querySelectorAll('.mobile-menu-item');
                menuItems.forEach(item => {
                    item.classList.remove('hide');
                });
                const menuLinkItems = document.querySelector('.mobile-menu-nav');
                menuLinkItems.classList.remove('menu-open');
            }, 100);
        }

        function resetMobileMenu() {
            // Hide all submenus
            mobileSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
                submenu.style.display = 'none';
            });

            // Show all menu items
            const menuItems = mobileMenuList.querySelectorAll('.mobile-menu-item');
            menuItems.forEach(item => {
                item.classList.remove('hide');
            });
            const menuLinkItems = document.querySelector('.mobile-menu-nav');
                menuLinkItems.classList.remove('menu-open');
        }
    }

    // Initialize mobile menu
    initMobileMenu();

    // Search Popup Functionality
    function initSearchPopup() {
        const searchButton = document.querySelector('.thegem-te-search__item a');
        const searchPopupOverlay = document.getElementById('search-popup-overlay');
        const searchPopupClose = document.getElementById('search-popup-close');
        const searchPopupInput = document.getElementById('search-popup-input');
        const searchPopupForm = document.querySelector('.search-popup-form');

        // Open search popup
        if (searchButton) {
            searchButton.addEventListener('click', function (e) {
                e.preventDefault();
                openSearchPopup();
            });
        }

        // Close search popup
        if (searchPopupClose) {
            searchPopupClose.addEventListener('click', function () {
                closeSearchPopup();
            });
        }

        // Close popup when clicking overlay
        if (searchPopupOverlay) {
            searchPopupOverlay.addEventListener('click', function (e) {
                if (e.target === searchPopupOverlay) {
                    closeSearchPopup();
                }
            });
        }

        // Handle form submission
        if (searchPopupForm) {
            searchPopupForm.addEventListener('submit', function (e) {
                e.preventDefault();
                handleSearch();
            });
        }

        // Handle escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchPopupOverlay.classList.contains('active')) {
                closeSearchPopup();
            }
        });

        function openSearchPopup() {
            searchPopupOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus on input after animation
            setTimeout(() => {
                searchPopupInput.focus();
            }, 300);
        }

        function closeSearchPopup() {
            searchPopupOverlay.classList.remove('active');
            document.body.style.overflow = '';
            searchPopupInput.value = '';
        }

        function handleSearch() {
            const searchTerm = searchPopupInput.value.trim();
            if (searchTerm) {
                // Here you can implement the actual search functionality
                console.log('Searching for:', searchTerm);
                // For now, just close the popup
                closeSearchPopup();
                // You can redirect to search results page or show results
                // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    }

    // Initialize search popup
    initSearchPopup();

    // Scroll to Top Functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
