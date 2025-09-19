// ===== BACKEND INTEGRATION CONFIGURATION =====

const API_CONFIG = {
    // Replace this with your deployed backend URL from Render
    BASE_URL: 'https://backend-siyc.onrender.com/api',
    // For local development, use: 'http://localhost:5000/api'
    // Request timeout in milliseconds
    TIMEOUT: 50000,
    // Enable detailed logging
    DEBUG: false
};

// Global variables
let registrationData = {};
let currentPage = 'home';

// DOM elements
const cursorGlow = document.getElementById('cursor-glow');
const loadingScreen = document.getElementById('loading-screen');
const loadingBarFill = document.getElementById('loading-bar-fill');
const loadingPercentage = document.getElementById('loading-percentage');
const pages = document.querySelectorAll('.page');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCursorGlow();
    initializeLoadingScreen();
    initializeNavigation();
    initializeCountdownTimer();
    initializeRegistrationForm();
    initializePaymentPage();

    // Initialize enhanced features after a delay
    setTimeout(() => {
        addEnhancedHoverEffects();
        addDemoAutoFill();
        addSmoothTransitions();
        improveAccessibility();
        handleMobileInteractions();
    }, 1000);
});

// =============================================
// BACKEND INTEGRATION FUNCTION
// =============================================
async function submitRegistrationToBackend(registrationData) {
    try {
        console.log('Submitting registration to backend:', registrationData);
        const response = await fetch(`${API_CONFIG.BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        console.log('Registration successful:', result);
        return result;
    } catch (error) {
        console.error('Registration submission error:', error);
        
        // Handle specific error types
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please try again.');
        } else if (error.message.includes('Failed to fetch')) {
            throw new Error('Network error. Please check your connection and try again.');
        } else {
            throw error;
        }
    }
}

// =============================================
// ENHANCED ERROR HANDLING
// =============================================
function showErrorMessage(fieldName, message) {
    // Try to find existing error element
    let errorElement = document.getElementById(fieldName + '-error');
    
    // If no specific error element, create a general one
    if (!errorElement && fieldName === 'general') {
        errorElement = document.createElement('div');
        errorElement.id = 'general-error';
        errorElement.className = 'error-message general-error';
        errorElement.style.cssText = `
            background: rgba(255, 84, 89, 0.1);
            border: 1px solid rgba(255, 84, 89, 0.3);
            color: #ff5459;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 0;
            text-align: center;
            font-size: 14px;
        `;
        
        // Insert at top of form
        const form = document.getElementById('registration-form');
        if (form) {
            form.insertBefore(errorElement, form.firstChild);
        }
    }

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearErrorMessage(field) {
    const fieldName = field.name || field.id;
    const errorElement = document.getElementById(fieldName + '-error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// =============================================
// NETWORK CONNECTION CHECK
// =============================================
function checkNetworkConnection() {
    return navigator.onLine;
}

// Add network status indicator
window.addEventListener('online', () => {
    console.log('Network connection restored');
});

window.addEventListener('offline', () => {
    console.log('Network connection lost');
    showErrorMessage('general', 'No internet connection. Please check your network and try again.');
});

// Cursor glow effect
function initializeCursorGlow() {
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseenter', function() {
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function() {
        cursorGlow.style.opacity = '0';
    });
}

// Modern Loading Screen Animation - Enhanced for new aesthetic loading bar
function initializeLoadingScreen() {
    let progress = 0;
    const loadingBarFill = document.getElementById('loading-bar-fill');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingScreen = document.getElementById('loading-screen');

    // Enhanced progress calculation with more dynamic increments
    const interval = setInterval(() => {
        // Dynamic progress increments that slow down as we approach 100%
        const remainingProgress = 100 - progress;
        const increment = Math.max(0.8, Math.random() * (remainingProgress * 0.15) + 2);
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Enhanced completion sequence
            setTimeout(() => {
                // Add final glow burst effect
                loadingBarFill.style.animation += ', finalBurst 0.8s ease-out';
                loadingPercentage.style.animation += ', finalPercentGlow 0.8s ease-out';

                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    showPage('home');
                }, 1000);
            }, 500);
        }

        // Update loading bar width with enhanced easing
        const easedProgress = easeOutCubic(progress / 100) * 100;
        loadingBarFill.style.width = easedProgress + '%';
        loadingPercentage.textContent = Math.floor(progress) + '%';

        // Dynamic glow intensity based on progress
        const glowIntensity = progress / 100;
        const primaryGlow = 20 + (glowIntensity * 40);
        const secondaryGlow = 40 + (glowIntensity * 60);
        const tertiaryGlow = 60 + (glowIntensity * 90);

        // Enhanced box-shadow with multiple glow layers
        loadingBarFill.style.boxShadow = `
            0 0 ${primaryGlow}px rgba(255, 20, 147, ${0.8 + (glowIntensity * 0.2)}),
            0 0 ${secondaryGlow}px rgba(255, 20, 147, ${0.6 + (glowIntensity * 0.3)}),
            0 0 ${tertiaryGlow}px rgba(255, 20, 147, ${0.4 + (glowIntensity * 0.4)}),
            inset 0 1px 0 rgba(255, 255, 255, ${0.4 + (glowIntensity * 0.3)})
        `;

        // Add progress-based text glow enhancement
        const textGlow = 30 + (glowIntensity * 30);
        loadingPercentage.style.textShadow = `
            0 0 ${textGlow}px rgba(255, 20, 147, ${0.8 + (glowIntensity * 0.2)}),
            0 0 ${textGlow + 20}px rgba(255, 20, 147, ${0.5 + (glowIntensity * 0.3)})
        `;

        // Trigger percentage bounce animation on milestone progress
        if (progress % 25 < 2 && progress > 10) {
            loadingPercentage.style.animation = 'percentGlow 2s ease-in-out infinite alternate, percentBounce 0.6s ease-out';
            setTimeout(() => {
                loadingPercentage.style.animation = 'percentGlow 2s ease-in-out infinite alternate';
            }, 600);
        }

        // Dynamic progress dots activation
        updateProgressDots(progress);
    }, 120); // Slightly faster for smoother experience
}

// Easing function for smooth progress animation
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Update progress indication dots based on loading progress
function updateProgressDots(progress) {
    const progressDots = document.querySelectorAll('.progress-dot');
    progressDots.forEach((dot, index) => {
        const threshold = (index + 1) * 25; // 25%, 50%, 75%, 100%
        if (progress >= threshold) {
            dot.style.background = 'rgba(255, 20, 147, 1)';
            dot.style.boxShadow = '0 0 20px rgba(255, 20, 147, 0.8)';
            dot.style.transform = 'scale(1.2)';
        } else if (progress >= threshold - 10) {
            // Anticipation glow for upcoming milestone
            dot.style.background = `rgba(255, 20, 147, ${0.3 + ((progress - (threshold - 10)) / 10) * 0.7})`;
            dot.style.transform = `scale(${1 + ((progress - (threshold - 10)) / 10) * 0.2})`;
        }
    });
}

// Enhanced loading screen initialization with preloading effects
function enhancedLoadingInit() {
    const loadingScreen = document.getElementById('loading-screen');
    const particles = document.querySelectorAll('.loading-particles .particle');

    // Initialize particle animations with staggered delays
    particles.forEach((particle, index) => {
        particle.style.animationDelay = `${index * 1.2}s`;
    });

    // Add entrance animation to loading screen
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transform = 'scale(0.95)';
    setTimeout(() => {
        loadingScreen.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        loadingScreen.style.opacity = '1';
        loadingScreen.style.transform = 'scale(1)';

        // Start the main loading process after entrance animation
        setTimeout(() => {
            initializeLoadingScreen();
        }, 300);
    }, 100);
}

// Add final burst animation keyframes dynamically
function addFinalAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes finalBurst {
            0% {
                box-shadow:
                    0 0 60px rgba(255, 20, 147, 1),
                    0 0 120px rgba(255, 20, 147, 0.8),
                    0 0 180px rgba(255, 20, 147, 0.6);
            }
            50% {
                box-shadow:
                    0 0 100px rgba(255, 20, 147, 1),
                    0 0 200px rgba(255, 20, 147, 0.9),
                    0 0 300px rgba(255, 20, 147, 0.8);
                transform: scaleY(1.2);
            }
            100% {
                box-shadow:
                    0 0 80px rgba(255, 20, 147, 1),
                    0 0 160px rgba(255, 20, 147, 0.8),
                    0 0 240px rgba(255, 20, 147, 0.6);
                transform: scaleY(1);
            }
        }

        @keyframes finalPercentGlow {
            0% {
                text-shadow: 0 0 50px rgba(255, 20, 147, 1);
                transform: scale(1);
            }
            50% {
                text-shadow:
                    0 0 80px rgba(255, 20, 147, 1),
                    0 0 120px rgba(255, 215, 0, 0.8);
                transform: scale(1.15);
            }
            100% {
                text-shadow: 0 0 60px rgba(255, 20, 147, 1);
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization: Preload critical assets
function preloadAssets() {
    const assetsToPreload = [
        'Background Image.png', // Your background image
        // Add other critical assets here
    ];

    assetsToPreload.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset;
        link.as = asset.includes('.png') || asset.includes('.jpg') ? 'image' : 'fetch';
        document.head.appendChild(link);
    });
}

// Call preload function
preloadAssets();

// Navigation system - Updated for new ribbon navigation
function initializeNavigation() {
    // Navigation links - Updated event delegation for new nav structure
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-page]');
        if (target) {
            e.preventDefault();
            const targetPage = target.getAttribute('data-page');
            console.log('Navigating to:', targetPage); // Debug log
            showPage(targetPage);
            trackPageView(targetPage);
        }
    });

    // Also handle direct button clicks
    document.querySelectorAll('[data-page]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetPage = this.getAttribute('data-page');
            console.log('Direct navigation to:', targetPage); // Debug log
            showPage(targetPage);
            trackPageView(targetPage);
        });
    });
}

function showPage(pageName) {
    console.log('Showing page:', pageName); // Debug log
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;

        // Update navigation active state for new ribbon nav
        document.querySelectorAll('.nav-pill').forEach(pill => {
            pill.classList.remove('active');
        });

        const activeNavPill = document.querySelector(`[data-page="${pageName}"].nav-pill`);
        if (activeNavPill) {
            activeNavPill.classList.add('active');
        }

        // Special handling for payment page
        if (pageName === 'payment') {
            updatePaymentPage();
        }

        // Scroll to top of new page
        window.scrollTo(0, 0);
        console.log('Page switched to:', pageName); // Debug log
    } else {
        console.error('Page not found:', pageName); // Debug log
    }
}

// Countdown timer
function initializeCountdownTimer() {
    const targetDate = new Date('2025-09-29T12:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Calculate total hours including days
            const totalHours = days * 24 + hours;

            document.getElementById('hours').textContent = totalHours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Registration form handling - ENHANCED VERSION WITH BACKEND INTEGRATION
// Registration form handling - ENHANCED VERSION WITH BACKEND INTEGRATION
function initializeRegistrationForm() {
    // Open Google Form in new tab when 'Register Here' button is clicked
const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdfuBQlYgeuR8Sf5imMtmNniC41uudNutcf09Vz9dir0VmeGg/viewform?usp=dialog';

document.getElementById('register-here-btn').addEventListener('click', function() {
  window.open(googleFormURL, '_blank', 'noopener,noreferrer');
});

    const registrationForm = document.getElementById('registration-form');
    const successPopup = document.getElementById('success-popup');
    
    if (!registrationForm) return;

    registrationForm.addEventListener('submit', async function(e) {
    e.preventDefault();


    // Show loading state
    const submitButton = document.getElementById('registration-submit') || registrationForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        if (validateRegistrationForm()) {
            // Collect form data
            const registrationData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                status: document.querySelector('input[name="status"]:checked').value
            };

            // Make the fetch POST request to backend
            const response = await fetch(`${API_CONFIG.BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Request failed with status ${response.status}`);
            }

            // On success, show success popup or next steps
            document.getElementById('success-popup').classList.remove('hidden');

            // Optionally, navigate to payment page after delay
            setTimeout(() => {
                document.getElementById('success-popup').classList.add('hidden');
                showPage('payment');
            }, 2000);
        }
    } catch (error) {
        // Show any error messages to user
        showErrorMessage('general', error.message || 'Registration failed. Please try again.');

        // Hide error after 5 seconds
        setTimeout(() => clearErrorMessage({ id: 'general' }), 5000);
    } finally {
        // Reset submit button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});


    // Real-time validation
    const formInputs = registrationForm.querySelectorAll('input[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('input', function() {
            clearErrorMessage(this);
        });
    });

    // Status selection visual feedback
    document.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener('change', function() {
            clearErrorMessage(this);
            // Update visual selection
            document.querySelectorAll('.status-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.nextElementSibling.classList.add('selected');
        });
    });
}

function validateRegistrationForm() {
    let isValid = true;

    // Validate name
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        showErrorMessage('name', 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showErrorMessage('name', 'Name must be at least 2 characters');
        isValid = false;
    }

    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showErrorMessage('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showErrorMessage('email', 'Please enter a valid email');
        isValid = false;
    }

    // Validate phone
    const phone = document.getElementById('phone');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.value.trim()) {
        showErrorMessage('phone', 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.replace(/\D/g, ''))) {
        showErrorMessage('phone', 'Please enter a valid 10-digit phone number');
        isValid = false;
    }

    // Validate status
    const status = document.querySelector('input[name="status"]:checked');
    if (!status) {
        showErrorMessage('status', 'Please select your status');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const fieldName = field.name || field.id;
    switch (fieldName) {
        case 'name':
            if (!field.value.trim()) {
                showErrorMessage(fieldName, 'Name is required');
                return false;
            } else if (field.value.trim().length < 2) {
                showErrorMessage(fieldName, 'Name must be at least 2 characters');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                showErrorMessage(fieldName, 'Email is required');
                return false;
            } else if (!emailRegex.test(field.value.trim())) {
                showErrorMessage(fieldName, 'Please enter a valid email');
                return false;
            }
            break;
        case 'phone':
            const phoneRegex = /^[0-9]{10}$/;
            if (!field.value.trim()) {
                showErrorMessage(fieldName, 'Phone number is required');
                return false;
            } else if (!phoneRegex.test(field.value.replace(/\D/g, ''))) {
                showErrorMessage(fieldName, 'Please enter a valid 10-digit phone number');
                return false;
            }
            break;
    }

    clearErrorMessage(field);
    return true;
}

// Payment page handling
function initializePaymentPage() {
    const completePaymentBtn = document.getElementById('complete-payment');
    const transactionProof = document.getElementById('transaction-proof');
    const paymentSuccess = document.getElementById('payment-success');

    if (!completePaymentBtn) return;

    // Initially disable payment button
    completePaymentBtn.disabled = true;
    completePaymentBtn.style.opacity = '0.5';

    completePaymentBtn.addEventListener('click', function() {
        if (validatePaymentForm()) {
            console.log('Payment completed');

            // Show success animation
            paymentSuccess.classList.remove('hidden');

            // Auto-hide after 5 seconds
            setTimeout(() => {
                paymentSuccess.classList.add('hidden');
                showPage('home');
            }, 5000);
        }
    });

    // File input validation
    transactionProof.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, PNG, GIF)');
                this.value = '';
                completePaymentBtn.disabled = true;
                completePaymentBtn.style.opacity = '0.5';
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size must be less than 5MB');
                this.value = '';
                completePaymentBtn.disabled = true;
                completePaymentBtn.style.opacity = '0.5';
                return;
            }

            // File is valid, enable submit button
            completePaymentBtn.disabled = false;
            completePaymentBtn.style.opacity = '1';
        } else {
            completePaymentBtn.disabled = true;
            completePaymentBtn.style.opacity = '0.5';
        }
    });
}

function updatePaymentPage() {
    const priceDisplay = document.getElementById('price-display');
    if (priceDisplay && registrationData && registrationData.status) {
        const price = registrationData.status === 'single' ? '₹799' : '₹1400';
        priceDisplay.textContent = price;
        console.log('Updated price to:', price);
    }
}

function validatePaymentForm() {
    const transactionProof = document.getElementById('transaction-proof');
    if (!transactionProof.files || !transactionProof.files[0]) {
        alert('Please upload your transaction proof');
        return false;
    }
    return true;
}

// Enhanced hover effects - Updated for new navigation
function addEnhancedHoverEffects() {
    // Only LET'S GO button gets hover effects
    document.querySelectorAll('.lets-go-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 50px rgba(255, 20, 147, 0.8)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 0 30px rgba(255, 20, 147, 0.4)';
        });
    });

    // Activity cards hover
    document.querySelectorAll('.activity-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(255, 20, 147, 0.4)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // FAQ items hover
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.borderColor = 'rgba(255, 20, 147, 0.6)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.borderColor = 'rgba(255, 20, 147, 0.3)';
        });
    });
}

// Registration page cursor light effect
function initializeRegistrationCursorLight() {
    const registrationPage = document.getElementById('registration');
    if (registrationPage) {
        registrationPage.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create a more intense light effect for registration page
            const lightEffect = document.createElement('div');
            lightEffect.style.position = 'absolute';
            lightEffect.style.left = x + 'px';
            lightEffect.style.top = y + 'px';
            lightEffect.style.width = '200px';
            lightEffect.style.height = '200px';
            lightEffect.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)';
            lightEffect.style.borderRadius = '50%';
            lightEffect.style.pointerEvents = 'none';
            lightEffect.style.transform = 'translate(-50%, -50%)';
            lightEffect.style.transition = 'opacity 0.3s ease';
            lightEffect.style.zIndex = '1';

            this.appendChild(lightEffect);

            setTimeout(() => {
                lightEffect.style.opacity = '0';
                setTimeout(() => {
                    if (lightEffect.parentNode) {
                        lightEffect.parentNode.removeChild(lightEffect);
                    }
                }, 300);
            }, 100);
        });
    }
}

// Form auto-fill for demo purposes (development only)
function addDemoAutoFill() {
    // Double-click to auto-fill form for testing
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('dblclick', function() {
            document.getElementById('name').value = 'John Doe';
            document.getElementById('email').value = 'john@example.com';
            document.getElementById('phone').value = '9876543210';
            const singleRadio = document.querySelector('input[name="status"][value="single"]');
            if (singleRadio) {
                singleRadio.checked = true;
                singleRadio.dispatchEvent(new Event('change'));
            }
        });
    }
}

// Smooth page transitions
function addSmoothTransitions() {
    pages.forEach(page => {
        page.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

// Mobile responsiveness enhancements
function handleMobileInteractions() {
    // Touch events for mobile
    if ('ontouchstart' in window) {
        document.addEventListener('touchmove', function(e) {
            const touch = e.touches[0];
            cursorGlow.style.left = touch.clientX + 'px';
            cursorGlow.style.top = touch.clientY + 'px';
        });

        // Adjust glow size for mobile
        cursorGlow.style.width = '200px';
        cursorGlow.style.height = '200px';
    }
}

// Analytics and tracking (placeholder for real implementation)
function trackUserInteraction(action, page) {
    console.log(`User action: ${action} on page: ${page}`);
}

// Track page views
function trackPageView(pageName) {
    trackUserInteraction('page_view', pageName);
}

// Accessibility improvements
function improveAccessibility() {
    // Add ARIA labels for new navigation
    document.querySelectorAll('.nav-pill').forEach(pill => {
        pill.setAttribute('aria-label', `Navigate to ${pill.textContent}`);
    });

    // Add focus indicators
    document.querySelectorAll('input, button, select').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #ff1493';
        });
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Prevent form submission on Enter key for better UX
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.type !== 'submit' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        // If in registration form, focus next field
        if (currentPage === 'registration') {
            const formInputs = Array.from(document.querySelectorAll('#registration-form input, #registration-form select'));
            const currentIndex = formInputs.indexOf(e.target);
            if (currentIndex > -1 && currentIndex < formInputs.length - 1) {
                formInputs[currentIndex + 1].focus();
            }
        }
    }
});

// Error handling for registration
window.addEventListener('error', function(e) {
    console.error('Application Error:', e.error);
});

// Throttle function for performance optimization
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize enhanced loading system
document.addEventListener('DOMContentLoaded', function() {
    addFinalAnimations();
    enhancedLoadingInit();
    // Other existing initializations...
    initializeNavigation();
    initializeCountdownTimer();
    initializeRegistrationForm();
    initializePaymentPage();

    // Initialize enhanced features after loading completes
    setTimeout(() => {
        addEnhancedHoverEffects();
        addDemoAutoFill();
        addSmoothTransitions();
        improveAccessibility();
        handleMobileInteractions();
    }, 1000);
});
