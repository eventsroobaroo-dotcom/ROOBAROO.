// =============================================
// FRONTEND INTEGRATION UPDATE FOR APP.JS
// =============================================
// Add this code to your existing app.js file to integrate with the backend
// Replace the existing registration form submission logic

// =============================================
// BACKEND INTEGRATION FUNCTION
// =============================================
const API_CONFIG = {
       BASE_URL: 'https://https://roobaroo-2.onrender.com/api',
       // For local development: 'http://localhost:5000/api'
       TIMEOUT: 10000,
       DEBUG: false
   };
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
// UPDATED REGISTRATION FORM HANDLER
// =============================================
// Replace your existing registration form submission logic with this:

function initializeRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');
    const successPopup = document.getElementById('success-popup');
    
    if (!registrationForm) return;

    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Registration form submitted');

        // Show loading state
        const submitButton = document.getElementById('registration-submit') || registrationForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            if (validateRegistrationForm()) {
                // Store form data
                registrationData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    status: document.querySelector('input[name="status"]:checked').value
                };

                console.log('Registration data:', registrationData);

                // Submit to backend
                const result = await submitRegistrationToBackend(registrationData);

                // Show success popup
                successPopup.classList.remove('hidden');
                
                // Hide popup and navigate to payment after 2 seconds
                setTimeout(() => {
                    successPopup.classList.add('hidden');
                    showPage('payment');
                }, 2000);

            }
        } catch (error) {
            console.error('Registration failed:', error);
            
            // Show error message to user
            showErrorMessage('general', error.message || 'Registration failed. Please try again.');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                clearErrorMessage({ id: 'general' });
            }, 5000);
            
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });

    // Keep existing validation logic
    const formInputs = registrationForm.querySelectorAll('input[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearErrorMessage(this);
        });
    });

    // Keep existing status selection logic
    document.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener('change', function() {
            clearErrorMessage(this);
            document.querySelectorAll('.status-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.nextElementSibling.classList.add('selected');
        });
    });
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


// =============================================
// INSTRUCTIONS FOR IMPLEMENTATION
// =============================================

/*
TO INTEGRATE THIS WITH YOUR EXISTING APP.JS:

1. Update your API_CONFIG at the top of app.js:
   

2. Replace your existing initializeRegistrationForm() function with the one above

3. Add the submitRegistrationToBackend() function

4. Add the enhanced error handling functions

5. Test the integration:
   - Fill out the form
   - Submit it
   - Check that data appears in your Google Sheet
   - Verify error handling works

THAT'S IT! Your frontend will now communicate with your backend automatically.
*/
