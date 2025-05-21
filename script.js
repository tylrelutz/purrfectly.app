// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu a');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close menu when a link is clicked
    if (menuLinks.length > 0) {
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Set up UI collage elements
    const uiElementContainers = document.querySelectorAll('.ui-element-container');
    const uiCollage = document.querySelector('.ui-collage');
    
    // Get the rotation value based on index
    function getRotationValue(index) {
        const rotations = [
            '-2deg', '2deg', '-1deg', '1.5deg', '-2deg',
            '1deg', '-0.5deg', '2deg', '0deg', '1.5deg'
        ];
        return rotations[index] || '0deg';
    }
    
    function applyParallax(e) {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        
        uiElementContainers.forEach((container, index) => {
            if (container.style.display !== 'none') {
                const depth = parseFloat(container.getAttribute('data-depth') || 0.02);
                const rotation = container.getAttribute('data-rotation') || '0deg';
                const translateX = mouseX * depth * 20;
                const translateY = mouseY * depth * 20;
                
                // Apply parallax effect without disrupting the float animation
                container.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation})`;
            }
        });
    }
    
    // Apply animation delays to UI elements
    if (uiElementContainers.length > 0) {
        // Add sequential animation delays
        uiElementContainers.forEach((container, index) => {
            container.style.animationDelay = `${index * 0.15}s`;
            
            // Special handling for center image (element 9, which is index 8)
            if (index === 8) {
                // Center image gets more prominent but subtle animation
                const centerKeyframes = `
                @keyframes centerFloat {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(-10px) rotate(0deg); }
                }`;
                
                try {
                    const styleSheet = document.styleSheets[0];
                    styleSheet.insertRule(centerKeyframes, styleSheet.cssRules.length);
                    container.style.animation = `fadeIn 1.5s ease-out forwards, centerFloat 4s ease-in-out infinite alternate`;
                    container.setAttribute('data-depth', '0.01'); // Less parallax effect
                    container.setAttribute('data-rotation', '0deg');
                    
                    // Force element 10 to be visible
                    container.style.display = 'block !important';
                    container.style.opacity = '1 !important';
                    container.style.visibility = 'visible !important';
                    container.style.zIndex = '7'; // Ensure it's on top
                } catch(e) {
                    container.style.animation = `fadeIn 1.5s ease-out forwards`;
                    // Fallback
                    container.style.display = 'block';
                    container.style.opacity = '1';
                    container.style.visibility = 'visible';
                }
            } 
            // Regular animation for other elements
            else {
                // Add subtle floating animation effect
                const floatDuration = 3 + Math.random() * 2; // Random duration between 3-5s
                const floatAmount = 8 + Math.random() * 5; // Random float amount 8-13px
                
                container.style.animation = `fadeIn 1.5s ease-out forwards, float ${floatDuration}s ease-in-out infinite alternate`;
                
                // Add custom floating keyframes for each element
                const styleSheet = document.styleSheets[0];
                const keyframes = `
                @keyframes float${index} {
                    0% { transform: translateY(0) rotate(${getRotationValue(index)}); }
                    100% { transform: translateY(-${floatAmount}px) rotate(${getRotationValue(index)}); }
                }`;
                
                try {
                    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
                    container.style.animation = `fadeIn 1.5s ease-out forwards, float${index} ${floatDuration}s ease-in-out infinite alternate`;
                    
                    // For parallax effect
                    container.setAttribute('data-depth', (0.02 + (Math.random() * 0.04)).toFixed(2));
                    container.setAttribute('data-rotation', getRotationValue(index));
                } catch(e) {
                    // Fallback for browsers that don't support dynamic style insertion
                    container.style.animation = `fadeIn 1.5s ease-out forwards`;
                }
            }
        });
        
        // Subtle parallax effect on mousemove - with throttling for performance
        let ticking = false;
        document.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) { // Only on larger screens
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        applyParallax(e);
                        ticking = false;
                    });
                    ticking = true;
                }
            }
        });
    }
    
    // Set variables for iOS vh fix
    function setVhVariable() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Call it on first load
    setVhVariable();
    
    // Call on resize and orientation change
    window.addEventListener('resize', setVhVariable);
    window.addEventListener('orientationchange', setVhVariable);
    
    // Function for scroll animations
    function toggleHeaderClass() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
    
    // Add scroll event listener for header
    window.addEventListener('scroll', toggleHeaderClass);

    // Mobile feature list enhancement for iOS
    if (window.innerWidth <= 480) {
        setupMobileFeatureLists();
    }

    // Recheck on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 480) {
            setupMobileFeatureLists();
        }
    });

    function setupMobileFeatureLists() {
        const featureContainers = document.querySelectorAll('.feature-list-container');
        
        featureContainers.forEach(container => {
            // Add subtle visual feedback on touch
            container.addEventListener('touchstart', function() {
                this.style.backgroundColor = 'rgba(126, 34, 206, 0.08)';
            });
            
            container.addEventListener('touchend', function() {
                this.style.backgroundColor = 'rgba(126, 34, 206, 0.04)';
            });

            // Add smooth scroll to ensure section is visible after user taps the container
            container.addEventListener('click', function() {
                const section = this.closest('.app-section');
                if (section) {
                    // Smooth scroll to ensure the section is visible
                    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: sectionTop - 20,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Add animation to buttons for better mobile feedback
    const buttons = document.querySelectorAll('.btn, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.97)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Fix for mobile viewport height issues
function setMobileViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize vh variable
setMobileViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', setMobileViewportHeight);
window.addEventListener('orientationchange', setMobileViewportHeight);

// Early Access Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const earlyAccessForm = document.getElementById('early-access-form');
    
    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', function(e) {
            // Don't prevent default - let the form submit naturally to FormSubmit
            // But show a success message after submission
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            
            if (!nameInput.value.trim() || !emailInput.value.trim()) {
                e.preventDefault();
                return; // Form validation will handle this
            }
            
            // Form will submit normally to FormSubmit service
            // We'll just store a flag to show success message when user returns
            localStorage.setItem('formSubmitted', 'true');
            localStorage.setItem('submittedName', nameInput.value.trim());
        });
    }
    
    // Check if user is returning after form submission
    if (localStorage.getItem('formSubmitted') === 'true') {
        const submittedName = localStorage.getItem('submittedName') || 'there';
        
        if (earlyAccessForm) {
            earlyAccessForm.innerHTML = `
                <div class="success-message">
                    <h3>Thanks, ${submittedName}!</h3>
                    <p>We've added you to our early access list. We'll be in touch soon!</p>
                </div>
            `;
        }
        
        // Clear the submission flag so it only shows once
        localStorage.removeItem('formSubmitted');
        localStorage.removeItem('submittedName');
    }
}); 