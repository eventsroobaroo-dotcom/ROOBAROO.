// ===== BACKEND INTEGRATION CONFIGURATION =====

const API_CONFIG = {

// Replace this with your deployed backend URL from Render

BASE_URL: 'https://backend-siyc.onrender.com/api',

// For local development, use: 'http://localhost:5000/api'

// Request timeout in milliseconds

TIMEOUT: 50000,

// Enable detailed logging

DEBUG: true

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

console.log('DOM loaded, initializing application...');



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
/*
function initializeCursorGlow() {

if (!cursorGlow) return;

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
*/

// Modern Loading Screen Animation - Enhanced for new aesthetic loading bar

function initializeLoadingScreen() {

if (!loadingScreen || !loadingBarFill || !loadingPercentage) {

console.error('Loading screen elements not found');

return;

}

let progress = 0;

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

// Navigation system - FIXED VERSION

function initializeNavigation() {

console.log('Initializing navigation...');

// Use event delegation for better performance and to handle all navigation elements

document.addEventListener('click', function(e) {

// Find the closest element with data-page attribute

const target = e.target.closest('[data-page]');

if (target) {

e.preventDefault();

e.stopPropagation();

const targetPage = target.getAttribute('data-page');

console.log('Navigation clicked:', target, 'Target page:', targetPage);

if (targetPage) {

showPage(targetPage);

trackPageView(targetPage);

}

}

});

console.log('Navigation initialized');

}

function showPage(pageName) {

console.log('SHOWPAGE: Attempting to show page:', pageName);

if (!pageName) {

console.error('SHOWPAGE: No page name provided');

return;

}

// Hide all pages

pages.forEach(page => {

page.classList.remove('active');

console.log('SHOWPAGE: Removed active from', page.id);

});

// Show target page

const targetPage = document.getElementById(pageName);

if (targetPage) {

targetPage.classList.add('active');

currentPage = pageName;

console.log('SHOWPAGE: Successfully activated page:', pageName);

// Update navigation active state

document.querySelectorAll('.nav-pill').forEach(pill => {

pill.classList.remove('active');

});

const activeNavPill = document.querySelector(`[data-page="${pageName}"].nav-pill`);

if (activeNavPill) {

activeNavPill.classList.add('active');

console.log('SHOWPAGE: Updated nav pill active state');

}

// Special handling for payment page

if (pageName === 'payment') {

updatePaymentPage();

}

// Scroll to top of new page

window.scrollTo({ top: 0, behavior: 'smooth' });

} else {

console.error('SHOWPAGE: Page element not found:', pageName);

console.log('SHOWPAGE: Available pages:', Array.from(pages).map(p => p.id));

}

}

// Countdown timer

function initializeCountdownTimer() {

const targetDate = new Date('2025-09-29T12:00:00').getTime();

function updateCountdown() {

const now = new Date().getTime();

const timeLeft = targetDate - now;

const hoursElement = document.getElementById('hours');

const minutesElement = document.getElementById('minutes');

const secondsElement = document.getElementById('seconds');

if (timeLeft > 0) {

const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

// Calculate total hours including days

const totalHours = days * 24 + hours;

if (hoursElement) hoursElement.textContent = totalHours.toString().padStart(2, '0');

if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');

if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');

} else {

if (hoursElement) hoursElement.textContent = '00';

if (minutesElement) minutesElement.textContent = '00';

if (secondsElement) secondsElement.textContent = '00';

}

}

updateCountdown();

setInterval(updateCountdown, 1000);

}

// Registration form handling - ENHANCED VERSION WITH BACKEND INTEGRATION

function initializeRegistrationForm() {

// Open Google Form in new tab when 'Register Here' button is clicked

const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdfuBQlYgeuR8Sf5imMtmNniC41uudNutcf09Vz9dir0VmeGg/viewform?usp=dialog';

const registerHereBtn = document.getElementById('register-here-btn');

if (registerHereBtn) {

registerHereBtn.addEventListener('click', function() {

window.open(googleFormURL, '_blank', 'noopener,noreferrer');

});

}

const registrationForm = document.getElementById('registration-form');

const successPopup = document.getElementById('success-popup');

if (!registrationForm) {

console.warn('Registration form not found');

return;

}

registrationForm.addEventListener('submit', async function(e) {

e.preventDefault();

console.log('Form submitted');

// Show loading state

const submitButton = document.getElementById('registration-submit') || registrationForm.querySelector('button[type="submit"]');

const originalButtonText = submitButton ? submitButton.textContent : '';

if (submitButton) {

submitButton.disabled = true;

submitButton.textContent = 'Submitting...';

}

try {

if (validateRegistrationForm()) {

// Collect form data

const registrationData = {

name: document.getElementById('name')?.value.trim(),

email: document.getElementById('email')?.value.trim(),

phone: document.getElementById('phone')?.value.trim(),

status: document.querySelector('input[name="status"]:checked')?.value

};

console.log('Collected registration data:', registrationData);

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

// On success, show success popup

if (successPopup) {

successPopup.classList.remove('hidden');

// Navigate to payment page after delay

setTimeout(() => {

successPopup.classList.add('hidden');

showPage('payment');

}, 2000);

}

}

} catch (error) {

console.error('Registration error:', error);

// Show any error messages to user

showErrorMessage('general', error.message || 'Registration failed. Please try again.');

// Hide error after 5 seconds

setTimeout(() => clearErrorMessage({ id: 'general' }), 5000);

} finally {

// Reset submit button state

if (submitButton) {

submitButton.disabled = false;

submitButton.textContent = originalButtonText;

}

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

if (name && !name.value.trim()) {

showErrorMessage('name', 'Name is required');

isValid = false;

} else if (name && name.value.trim().length < 2) {

showErrorMessage('name', 'Name must be at least 2 characters');

isValid = false;

}

// Validate email

const email = document.getElementById('email');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (email && !email.value.trim()) {

showErrorMessage('email', 'Email is required');

isValid = false;

} else if (email && !emailRegex.test(email.value.trim())) {

showErrorMessage('email', 'Please enter a valid email');

isValid = false;

}

// Validate phone

const phone = document.getElementById('phone');

const phoneRegex = /^[0-9]{10}$/;

if (phone && !phone.value.trim()) {

showErrorMessage('phone', 'Phone number is required');

isValid = false;

} else if (phone && !phoneRegex.test(phone.value.replace(/\D/g, ''))) {

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

if (paymentSuccess) {

paymentSuccess.classList.remove('hidden');

// Auto-hide after 5 seconds

setTimeout(() => {

paymentSuccess.classList.add('hidden');

showPage('home');

}, 5000);

}

}

});

// File input validation

if (transactionProof) {

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

if (!transactionProof || !transactionProof.files || !transactionProof.files[0]) {

alert('Please upload your transaction proof');

return false;

}

return true;

}

// Enhanced hover effects

function addEnhancedHoverEffects() {

// LET'S GO button hover effects

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

// Form auto-fill for demo purposes

function addDemoAutoFill() {

const registrationForm = document.getElementById('registration-form');

if (registrationForm) {

registrationForm.addEventListener('dblclick', function() {

const nameField = document.getElementById('name');

const emailField = document.getElementById('email');

const phoneField = document.getElementById('phone');

const singleRadio = document.querySelector('input[name="status"][value="single"]');

if (nameField) nameField.value = 'John Doe';

if (emailField) emailField.value = 'john@example.com';

if (phoneField) phoneField.value = '9876543210';

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

if ('ontouchstart' in window && cursorGlow) {

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

// Analytics and tracking

function trackUserInteraction(action, page) {

console.log(`User action: ${action} on page: ${page}`);

}

function trackPageView(pageName) {

trackUserInteraction('page_view', pageName);

}

// Accessibility improvements

function improveAccessibility() {

// Add ARIA labels for navigation

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

// Add final animations keyframes dynamically

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

// Add final animations when DOM loads

document.addEventListener('DOMContentLoaded', function() {

addFinalAnimations();

});

// Debug logging for navigation

if (API_CONFIG.DEBUG) {

console.log('Debug mode enabled');

console.log('Available pages:', Array.from(pages).map(p => p.id));

console.log('Navigation elements:', document.querySelectorAll('[data-page]'));

}
